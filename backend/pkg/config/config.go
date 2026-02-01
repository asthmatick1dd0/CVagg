// Package config provides configuration settings for the application
package config

import (
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
