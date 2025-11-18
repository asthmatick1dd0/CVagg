package service

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type AuthService interface {
}

type authService struct {
	repo repository.UserRepository
}

func NewAuthService(repo repository.UserRepository) AuthService {
	return &authService{repo}
}

// / Middleware для нормальной работы хендлеров разлогинивания и личной страницы
func DeserealizeUser(c *fiber.Ctx) error {
	var token string
	authData := c.Get("Authorization")
	if strings.HasPrefix(authData, "Bearer ") {
		token = strings.TrimPrefix(authData, "Bearer ")
	} else if c.Cookies("token") != "" {
		token = c.Cookies("token")
	}
	if token == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "you are not authorized"})
	}
	tokenByte, err := jwt.Parse(token, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok { //HS256 <-> HMAC
			return nil, fmt.Errorf("weird signing method: %s", t.Header["alg"])
		}
		return c.Locals("JWTSecret").([]byte), nil
	})
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(err)
	}
	claims, ok := tokenByte.Claims.(jwt.MapClaims)
	if !ok || !tokenByte.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON("invalid token claim")
	}
	userID, err := strconv.Atoi(fmt.Sprint(claims["sub"]))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(err)
	}
	user, err := c.Locals("userRepo").(repository.UserRepository).GetById(uint(userID))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(err)
	}
	c.Locals("user", user)
	return c.Next()
}
