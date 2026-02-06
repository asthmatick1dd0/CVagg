// Package config provides configuration settings for the application
package config

import (
	"crypto/rand"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/spf13/viper"
)

func NewConfig() *viper.Viper {
	conf := viper.New()

	// Читаем .env файл
	conf.SetConfigFile(".env")
	conf.SetConfigType("env")

	// Автоматически подхватываем переменные окружения
	conf.AutomaticEnv()

	// Пытаемся прочитать .env, если ошибка - используем только системные ENV
	_ = conf.ReadInConfig()

	// Устанавливаем дефолтные значения
	conf.SetDefault("DB_HOST", "localhost")
	conf.SetDefault("DB_PORT", "5432")
	conf.SetDefault("DB_USER", "postgres")
	conf.SetDefault("DB_PASSWORD", "postgres")
	conf.SetDefault("DB_NAME", "cvagg")
	conf.SetDefault("HTTP_PORT", "8080")
	conf.SetDefault("LOG_LEVEL", "debug")

	return conf
}

// Setting up JWT config for server
func GenerateJWTSecret() []byte {
	token := make([]byte, 32)
	rand.Read(token)
	return token
}

func ConfigJWT(app *fiber.App) {
	secret := GenerateJWTSecret()
	app.Use(func(c *fiber.Ctx) error {
		c.Locals("JWTExpirationTime", time.Hour*12)
		c.Locals("JWTSecret", secret)
		c.Locals("JWTMaxAge", 1440)
		return c.Next()
	})
}
