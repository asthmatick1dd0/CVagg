package auth

import (
	"os"
	"strings"
	"time"

	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	internal "github.com/asthmatick1dd0/CVagg/internal/validation"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler interface {
	SignUp(c *fiber.Ctx) error
	SignIn(c *fiber.Ctx) error
	LogOut(c *fiber.Ctx) error
	Me(c *fiber.Ctx) error
}

// TODO [CVAGG-45] Написать сервис аунтентификации и сделать небольшой рефактор
type authHandler struct {
	s AuthService
}

func NewAuthHandler(s AuthService) AuthHandler {
	return &authHandler{s: s}
}

func (h *authHandler) SignUp(c *fiber.Ctx) error {
	var input input.SignUpInput
	err := c.BodyParser(&input)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	errs := internal.ValidateStruct(input)
	if len(errs) != 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}

	repo := c.Locals("userRepo").(repository.UserRepository)
	var user models.User
	user.Email = input.Email
	user.Username = input.Username
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(err)
	}
	user.PasswordHash = string(passwordHash)
	if err := repo.Create(&user); err != nil {
		return c.Status(fiber.StatusInsufficientStorage).JSON(err)
	}
	return c.Status(fiber.StatusAccepted).JSON(input)
}

func (h *authHandler) SignIn(c *fiber.Ctx) error {
	var input input.SignInInputEmail

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	errs := internal.ValidateStruct(input)
	if len(errs) != 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}

	user, err := h.s.SignInUser(c, input)

	if err != nil {
		if strings.HasPrefix(err.Error(), "DB Issues") {
			return c.Status(fiber.StatusInternalServerError).JSON(err.Error())
		} else {
			return c.Status(fiber.StatusBadRequest).JSON(err.Error())
		}
	}

	tokenString, err := UserToToken(c, user)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(err.Error())
	}

	domain := os.Getenv("COOKIE_DOMAIN")
	if domain == "" {
		domain = "localhost"
	}
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    tokenString,
		Path:     "/",
		MaxAge:   c.Locals("JWTMaxAge").(int),
		Secure:   false,
		HTTPOnly: true,
		Domain:   domain,
	})

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{"tokenString": tokenString})
}

func (h *authHandler) LogOut(c *fiber.Ctx) error {
	user, err := h.s.UserFromCookie(c)
	if err != nil {
		return c.Status(fiber.StatusNetworkAuthenticationRequired).JSON(err.Error())
	}

	c.Cookie(&fiber.Cookie{
		Name:    "token",
		Value:   "",
		Expires: time.Now().Add(-time.Hour), //небольшая костылизация - возвращается просроченный токен
	})

	h.s.DeleteFromPool(user.ID)

	return c.SendString("Succesfully logged out")
}

// Теперь нужен лишь авторизационный токен в кукисах
func (h *authHandler) Me(c *fiber.Ctx) error {
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

	resp, err := h.s.RetrieveUserFromToken(token, c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"user": resp})
}
