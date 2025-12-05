// Package routes for setuping routes
package routes

import (
	"github.com/asthmatick1dd0/CVagg/internal/container"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	container := container.NewContainer()

	DashboardRoutes(app, container)
	// добавить контейнер как параметр, после написания хендлеров и добавления их в руты
	AuthRoutes(app, container)
	EditorRoutes(app, container)
}
