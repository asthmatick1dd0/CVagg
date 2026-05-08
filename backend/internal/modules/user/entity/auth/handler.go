package auth

import (
	"os"
	"strings"
	"time"

	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/modules/user"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/asthmatick1dd0/CVagg/pkg/validation"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Handler interface {
	SignUp(c *fiber.Ctx) error
	SignIn(c *fiber.Ctx) error
	LogOut(c *fiber.Ctx) error
	Me(c *fiber.Ctx) error
}

type handler struct {
	service  Service
	userRepo user.Repository // снести репо нахй отсюда
}

func NewHandler(s Service, userRepo user.Repository) Handler {
	return &handler{service: s, userRepo: userRepo}
}

func (h *handler) SignUp(c *fiber.Ctx) error {
	var input input.SignUpInput
	err := c.QueryParser(&input)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	errs := validation.ValidateStruct(input)
	if len(errs) != 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}

	var user models.User
	user.Email = input.Email
	user.Username = input.Username
	user.Name = input.Name
	user.Surname = input.Surname
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(err)
	}
	user.PasswordHash = string(passwordHash)
	if err := h.userRepo.Create(&user); err != nil {
		return c.Status(fiber.StatusInsufficientStorage).JSON(err)
	}
	return c.Status(fiber.StatusAccepted).JSON(input)
}

func (h *handler) SignIn(c *fiber.Ctx) error {
	var input input.SignInInputEmail

	if err := c.QueryParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	errs := validation.ValidateStruct(input)
	if len(errs) != 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}

	user, err := h.service.SignInUser(c, input)
	if err != nil {
		if strings.HasPrefix(err.Error(), "DB Issues") {
			return c.Status(fiber.StatusInternalServerError).JSON(err.Error())
		} else {
			return c.Status(fiber.StatusBadRequest).JSON(err.Error())
		}
	}

	tokenString, err := h.service.UserToToken(c, user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(err.Error())
	}

	//TODO: вынести то шо внизу в сервис
	domain := os.Getenv("COOKIE_DOMAIN")
	if domain == "" {
		domain = "localhost"
	}
	c.Cookie(&fiber.Cookie{
		Name:  "token",
		Value: tokenString,
		Path:  "/",
		// MaxAge:   c.Locals("JWTMaxAge").(int),
		Secure:   false,
		HTTPOnly: true,
		Domain:   domain,
	})

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{"tokenString": tokenString})
}

func (h *handler) LogOut(c *fiber.Ctx) error {
	user, err := h.service.UserFromCookie(c)
	if err != nil {
		return c.Status(fiber.StatusNetworkAuthenticationRequired).JSON(err.Error())
	}

	c.Cookie(&fiber.Cookie{
		Name:    "token",
		Value:   "",
		Expires: time.Now().Add(-time.Hour),
	})

	h.service.DeleteFromPool(user.ID)

	return c.SendString("Succesfully logged out")
}

func (h *handler) Me(c *fiber.Ctx) error {
	tokenString := c.Cookies("token")

	if len(tokenString) == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON("missing auth cookie")
	}

	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (any, error) {
		return c.Locals("JWTSecret").([]byte), nil
	})
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	resp, err := h.service.RetrieveUserFromToken(token, c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"user": resp})
}
