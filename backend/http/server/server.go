package server

import (
	"github.com/asthmatick1dd0/CVagg/http/server/routes"
	"github.com/asthmatick1dd0/CVagg/internal/modules/dashboard"
	"github.com/asthmatick1dd0/CVagg/internal/modules/editor"
	"github.com/asthmatick1dd0/CVagg/internal/modules/user/entity/auth"
	"github.com/asthmatick1dd0/CVagg/pkg/config"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func NewServerHTTP(
	authHandler auth.Handler,
	dashboardHandler dashboard.Handler,
	editorHandler editor.Handler,
) *fiber.App {
	app := fiber.New(fiber.Config{
		AppName: "CVagg API",
	})

	app.Use(logger.New())
	app.Use(recover.New())

	config.ConfigJWT(app)
	app.Static("/images", "images")

	api := app.Group("/api")
	v1 := api.Group("/v1")
	{
		v1.Get("/check_alive", func(c *fiber.Ctx) error {
			return c.JSON(fiber.Map{"status": "ok"})
		})

		routes.AuthGroup(v1, authHandler)
		routes.DashboardGroup(v1, dashboardHandler)
		routes.EditorGroup(v1, editorHandler)
	}

	return app
}
