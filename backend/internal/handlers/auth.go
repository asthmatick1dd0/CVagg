package handlers

import (
	"crypto/ecdsa"
	"time"

	"github.com/asthmatick1dd0/CVagg/internal/container"
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/asthmatick1dd0/CVagg/internal/service"
	"github.com/asthmatick1dd0/CVagg/internal/transport/dto"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	internal "github.com/asthmatick1dd0/CVagg/internal/validation"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler interface {
	SignUp(c *fiber.Ctx) error
}

// TODO [CVAGG-45] Написать сервис аунтентификации и сделать небольшой рефактор
type authHandler struct {
	s service.AuthService
}

func NewAuthHandler(s service.AuthService) AuthHandler {
	return &authHandler{s: s}
}

func (h *authHandler) SignUp(c *fiber.Ctx, cont *container.HandlerContainer) error {
	var input input.SignUpInput
	err := c.QueryParser(&input)
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
	//TODO: Добавить в валидацию требование чтобы пароль состоял тока из ASCII символов и был длиной <= 72 символа
	//TODO: Придумать какой-то более надёжный ключ, чем bcrypt.DefaultCost
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

func SignInHandler(c *fiber.Ctx) error {
	var input input.SignInInputEmail
	if err := c.QueryParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(err.Error())
	}
	errs := internal.ValidateStruct(input)
	if len(errs) != 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}
	repo := c.Locals("userRepo").(repository.UserRepository)
	ok, err := repo.ExistsByEmail(input.Email)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON("wrong email or password")
	}
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON("wrong email or password")
	}
	user, err := repo.GetByEmail(input.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(err)
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(err)
	}

	token := jwt.New(jwt.SigningMethodES256)
	now := time.Now().UTC()
	claims := token.Claims.(jwt.MapClaims)
	claims["sub"] = user.ID
	claims["iat"] = now
	claims["nbf"] = now
	claims["exp"] = now.Add(c.Locals("JWTExpirationTime").(time.Duration))
	key, _ := c.Locals("JWTSecret").(ecdsa.PrivateKey)
	tokenString, err := token.SignedString(&key)
	// panic: interface conversion: interface {} is *ecdsa.PrivateKey, not ecdsa.PrivateKey
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(err.Error())
	}
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    tokenString,
		Path:     "/",
		MaxAge:   c.Locals("JWTMaxAge").(int),
		Secure:   false,
		HTTPOnly: true,
		Domain:   "localhost",
	})

	return c.Status(fiber.StatusAccepted).JSON(input)
}

func LogOutHandler(c *fiber.Ctx) error {
	c.Cookie(&fiber.Cookie{
		Name:    "token",
		Value:   "",
		Expires: time.Now().Add(-time.Hour), //небольшая костылизация - возвращается просроченный токен
	})
	return c.SendString("Succesfully logged out")
}

func MeHandler(c *fiber.Ctx) error {
	user := c.Locals("user").(dto.UserResponse)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"data": fiber.Map{"user": user}})
}
