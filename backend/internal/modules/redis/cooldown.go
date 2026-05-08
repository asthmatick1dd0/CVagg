package redis

import (
	"fmt"
	"time"

	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"github.com/gofiber/fiber/v2"
	"github.com/redis/go-redis/v9"
)

type Repository interface {
	IsOnCooldown(ctx *fiber.Ctx, userID string) (bool, time.Duration, cvaggerr.Error)
	SetCooldown(ctx *fiber.Ctx, userID string, duration time.Duration) cvaggerr.Error
}

type cooldownRepo struct {
	rdb    *redis.Client
	logger *cvagglog.Logger
}

func NewRepository(rdb *redis.Client, logger *cvagglog.Logger) Repository {
	return &cooldownRepo{
		rdb:    rdb,
		logger: logger,
	}
}

func (r *cooldownRepo) IsOnCooldown(ctx *fiber.Ctx, userID string) (bool, time.Duration, cvaggerr.Error) {
	ttl, err := r.rdb.TTL(ctx.Context(), r.key(userID)).Result()
	if err != nil {
		r.logger.Error(fmt.Sprintf("Error in redis: %v", err))
		return false, 0, cvaggerr.ErrorDataBase()
	}

	if ttl > 0 {
		return true, ttl, nil
	}

	return false, 0, nil
}

func (r *cooldownRepo) SetCooldown(ctx *fiber.Ctx, userID string, duration time.Duration) cvaggerr.Error {
	err := r.rdb.Set(ctx.Context(), r.key(userID), "1", duration).Err()
	if err != nil {
		r.logger.Error(fmt.Sprintf("Error in redis: %v", err))
		return cvaggerr.ErrorDataBase()
	}

	return nil
}

func (r *cooldownRepo) key(userID string) string {
	return "cooldown:" + userID
}
