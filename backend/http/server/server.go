package server

import (
	"github.com/asthmatick1dd0/CVagg/http/server/routes"
	"github.com/asthmatick1dd0/CVagg/internal/modules/auth"
	"github.com/asthmatick1dd0/CVagg/internal/modules/dashboard"
	"github.com/asthmatick1dd0/CVagg/internal/modules/editor"
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

	api := app.Group("/api")
	{
		api.Get("/check_alive", func(c *fiber.Ctx) error {
			return c.JSON(fiber.Map{"status": "ok"})
		})

		routes.AuthGroup(api, authHandler)
		routes.DashboardGroup(api, dashboardHandler)
		routes.EditorGroup(api, editorHandler)
	}

	return app
}
