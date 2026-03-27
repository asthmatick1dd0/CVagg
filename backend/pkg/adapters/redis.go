// Package adapters contains adapters for different services
package adapters

import (
	"context"
	"fmt"

	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"github.com/redis/go-redis/v9"
	"github.com/spf13/viper"
)

type redisData struct {
	Host     string
	Port     int
	Password string
	DB       int
}

func importRedisData(conf *viper.Viper) *redisData {
	return &redisData{
		Host:     conf.GetString("REDIS_HOST"),
		Port:     conf.GetInt("REDIS_PORT"),
		Password: conf.GetString("REDIS_PASSWORD"),
		DB:       conf.GetInt("REDIS_DB"),
	}
}

func NewRedis(conf *viper.Viper, cvagglogger *cvagglog.Logger) *redis.Client {
	connection := importRedisData(conf)
	
	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", connection.Host, connection.Port),
		Password: connection.Password,
		DB:       connection.DB,
	})

	ctx := context.Background()
	if err := rdb.Ping(ctx).Err(); err != nil {
		cvagglogger.Fatal("Redis connection failed: " + err.Error())
	}

	cvagglogger.Info("Redis connected")
	return rdb
}
