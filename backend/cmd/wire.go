//go:build wireinject
// +build wireinject

package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/wire"
	"github.com/spf13/viper"
	"github.com/vertica/vertica-sql-go/logger"
	"gorm.io/gorm"
)

type App struct {
	Fiber *fiber.App
}

var ServerSet = wire.NewSet(server.NewServerHTTP)

var HandlerSet = wire.NewSet(
	userHandler.NewHandler,
)

var ServiceSet = wire.NewSet(
	userSvc.NewService,
)

var RepositorySet = wire.NewSet(
	userRepo.NewRepository,
)

func provideApp(app *fiber.App) (App, func()) {
	cleanup := func() {
		app.Shutdown()
	}
	return App{Fiber: app}, cleanup
}

func newApp(*viper.Viper, *logger.Logger, *gorm.DB) (App, func(), error) {
	panic(wire.Build(
		ServerSet,
		HandlerSet,
		ServiceSet,
		RepositorySet,
		provideApp,
	))
}
