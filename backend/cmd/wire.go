//go:build wireinject
// +build wireinject

package main

import (
	"github.com/asthmatick1dd0/CVagg/http/server"
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
	cooldownRepo "github.com/asthmatick1dd0/CVagg/internal/modules/redis"
	"github.com/asthmatick1dd0/CVagg/internal/modules/user"
	"github.com/asthmatick1dd0/CVagg/internal/modules/user/entity/auth"
	"github.com/asthmatick1dd0/CVagg/pkg/adapters/llm"
	"github.com/asthmatick1dd0/CVagg/pkg/adapters/llm/client/yandex"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"github.com/gofiber/fiber/v2"
	"github.com/google/wire"
	"github.com/redis/go-redis/v9"
	"github.com/spf13/viper"
	"gorm.io/gorm"
)

type App struct {
	Fiber *fiber.App
}

func provideYandexClient(v *viper.Viper) llm.LLMClient {
	return yandex.New(v.GetString("YANDEX_API_KEY"), v.GetString("YANDEX_FOLDER_ID"))
}

// Handlers
var HandlerSet = wire.NewSet(
	auth.NewHandler,
	dashboard.NewHandler,
	editor.NewHandler,
)

// Services
var ServiceSet = wire.NewSet(
	auth.NewService,
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
	cooldownRepo.NewRepository,
)

// Server
var ServerSet = wire.NewSet(server.NewServerHTTP)

func provideApp(app *fiber.App) (App, func()) {
	cleanup := func() {
		app.Shutdown()
	}
	return App{Fiber: app}, cleanup
}

func newApp(*viper.Viper, *cvagglog.Logger, *gorm.DB, *redis.Client) (App, func(), error) {
	panic(wire.Build(
		ServerSet,
		HandlerSet,
		ServiceSet,
		RepositorySet,
		provideApp,
		provideYandexClient,
	))
}
