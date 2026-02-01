package auth

import (
	"fmt"
	"strconv"
	"time"

	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/modules/user"
	"github.com/asthmatick1dd0/CVagg/internal/transport/dto"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Service interface {
	AddToPool(id uint, user *models.User) error
	GetFromPool(id uint) (*models.User, error)
	DeleteFromPool(id uint)

	UserFromCookie(c *fiber.Ctx) (dto.UserResponse, error)
	RetrieveUserFromToken(t *jwt.Token, c *fiber.Ctx) (dto.UserResponse, error)

	SignInUser(c *fiber.Ctx, input input.SignInInputEmail) (*models.User, error)
}

type authService struct {
	repo     user.Repository
	userPool map[uint]*models.User
}

func NewAuthService(repo user.Repository) Service {
	return &authService{repo, make(map[uint]*models.User)} // для быстрого доступа к авторизованным юзерам, хранится только в оперативной памяти хоста
}

func (as *authService) AddToPool(id uint, user *models.User) error {
	// if _, ok := as.userPool[id]; ok {
	// 	return fmt.Errorf("user with id %d already exists in pool", id)
	// }
	as.userPool[id] = user
	return nil
}

func (as authService) GetFromPool(id uint) (*models.User, error) {
	user, ok := as.userPool[id]
	if !ok {
		return user, fmt.Errorf("user with id %d not found in pool", id)
	}
	return user, nil
}

func (as *authService) DeleteFromPool(id uint) {
	delete(as.userPool, id)
}

// / Middleware для нормальной работы хендлеров разлогинивания и личной страницы
func DeserealizeUser(c *fiber.Ctx) error {
	var token string
	// authData := c.Get("Authorization")
	token = c.Cookies("token")

	if token == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "you are not authorized"})
	}

	tokenByte, err := jwt.Parse(token, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok { // HS256 <-> HMAC
			return nil, fmt.Errorf("weird signing method: %s", t.Header["alg"])
		}
		return c.Locals("JWTSecret").([]byte), nil
	}) // ОШИБКА вот здесь
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(err.Error())
	}

	claims, ok := tokenByte.Claims.(jwt.MapClaims)
	if !ok || !tokenByte.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON("invalid token claim")
	}

	userID, err := strconv.Atoi(fmt.Sprint(claims["sub"]))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(err)
	}
	user, err := c.Locals("userRepo").(user.Repository).GetByID(uint(userID))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(err)
	}

	c.Locals(user.ID, user)
	return c.Next()
}

func CookieToToken(cookieStr string, c *fiber.Ctx) (*jwt.Token, error) {
	if len(cookieStr) == 0 {
		return &jwt.Token{}, c.Status(fiber.StatusUnauthorized).JSON("missing auth cookie")
	}

	token, err := jwt.Parse(cookieStr, func(t *jwt.Token) (any, error) {
		return c.Locals("JWTSecret").([]byte), nil
	})
	if err != nil {
		return &jwt.Token{}, c.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	return token, err
}

func (as authService) RetrieveUserFromToken(t *jwt.Token, c *fiber.Ctx) (dto.UserResponse, error) {
	claims := t.Claims.(jwt.MapClaims)

	created, _ := claims["iat"].(float64)
	createdTime := time.Unix(int64(created), 0)
	updatedTime := time.Now().UTC().Truncate(time.Second)
	expired, _ := claims["exp"].(float64)
	expiredTime := time.Unix(int64(expired), 0)

	userID, _ := claims["sub"].(float64)

	user, err := as.GetFromPool(uint(userID))
	if err != nil {
		return dto.UserResponse{}, err
	}

	resp := dto.UserResponse{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		ExpiresAt: expiredTime,
		UpdatedAt: updatedTime,
		CreatedAt: createdTime,
	}

	return resp, nil
}

func (as authService) UserFromCookie(c *fiber.Ctx) (dto.UserResponse, error) {
	cookieStr := c.Cookies("token")

	token, err := CookieToToken(cookieStr, c)
	if err != nil {
		return dto.UserResponse{}, nil
	}

	return as.RetrieveUserFromToken(token, c)
}

// Записывает в кукис авторизационный токен при успешной авторизации
func (as *authService) SignInUser(c *fiber.Ctx, input input.SignInInputEmail) (*models.User, error) {
	repo := c.Locals("userRepo").(user.Repository)
	var user *models.User

	ok, err := repo.ExistsByEmail(input.Email)
	if err != nil || !ok {
		return user, fmt.Errorf("user not found by email %s", input.Email)
	}

	user, err = repo.GetByEmail(input.Email)
	if err != nil {
		return user, fmt.Errorf("DB issues, can not get user by email %s", user.Email)
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		return user, fmt.Errorf("wrong password")
	}

	if err := as.AddToPool(user.ID, user); err != nil {
		return user, fmt.Errorf("user %s already authorized", user.Username)
	}

	return user, nil
}

func UserToToken(c *fiber.Ctx, user *models.User) (string, error) {
	// ВСЕ числовые значения по непонятной причине приводятся к float64 при записи в JWT
	token := jwt.New(jwt.SigningMethodHS256)
	now := time.Now().UTC()
	claims := token.Claims.(jwt.MapClaims)
	claims["sub"] = user.ID
	claims["iat"] = now.Unix()
	claims["nbf"] = now.Unix()
	claims["exp"] = now.Add(c.Locals("JWTExpirationTime").(time.Duration)).Unix()
	fmt.Println(claims["iat"])

	key, _ := c.Locals("JWTSecret").([]byte)
	return token.SignedString(key)
}
