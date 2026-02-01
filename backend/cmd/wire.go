//go:build wireinject
// +build wireinject

package main

import (
	"github.com/asthmatick1dd0/CVagg/http/server"
	"github.com/asthmatick1dd0/CVagg/internal/modules/auth"
	authService "github.com/asthmatick1dd0/CVagg/internal/modules/auth"
	"github.com/asthmatick1dd0/CVagg/internal/modules/dashboard"
	dashboardService "github.com/asthmatick1dd0/CVagg/internal/modules/dashboard"
	"github.com/asthmatick1dd0/CVagg/internal/modules/editor"
	aboutRepo "github.com/asthmatick1dd0/CVagg/internal/modules/editor/entity/about"
	customRepo "github.com/asthmatick1dd0/CVagg/internal/modules/editor/entity/custom"
	educationRepo "github.com/asthmatick1dd0/CVagg/internal/modules/editor/entity/education"
	hardSkillRepo "github.com/asthmatick1dd0/CVagg/internal/modules/editor/entity/hard_skill"
	jobExpRepo "github.com/asthmatick1dd0/CVagg/internal/modules/editor/entity/job_experience"
	personalDataRepo "github.com/asthmatick1dd0/CVagg/internal/modules/editor/entity/personal_data"
	resumeItemRepo "github.com/asthmatick1dd0/CVagg/internal/modules/editor/entity/resume_item"
	"github.com/asthmatick1dd0/CVagg/internal/modules/user"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"github.com/gofiber/fiber/v2"
	"github.com/google/wire"
	"github.com/spf13/viper"
	"gorm.io/gorm"
)

type App struct {
	Fiber *fiber.App
}

// Handlers
var HandlerSet = wire.NewSet(
	auth.NewHandler,
	dashboard.NewHandler,
	editor.NewHandler,
)

// Services
var ServiceSet = wire.NewSet(
	authService.NewAuthService,
	dashboardService.NewDashboardService,
	editor.NewService,
)

// Repositories
var RepositorySet = wire.NewSet(
	user.NewRepository,
	dashboard.NewRepository,
	aboutRepo.NewRepository,
	customRepo.NewRepository,
	educationRepo.NewRepository,
	hardSkillRepo.NewRepository,
	jobExpRepo.NewRepository,
	personalDataRepo.NewRepository,
	resumeItemRepo.NewRepository,
)

// Server
var ServerSet = wire.NewSet(server.NewServerHTTP)

func provideApp(app *fiber.App) (App, func()) {
	cleanup := func() {
		app.Shutdown()
	}
	return App{Fiber: app}, cleanup
}

func newApp(*viper.Viper, *cvagglog.Logger, *gorm.DB) (App, func(), error) {
	panic(wire.Build(
		ServerSet,
		HandlerSet,
		ServiceSet,
		RepositorySet,
		provideApp,
	))
}
