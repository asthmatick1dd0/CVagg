// Package routes for setuping routes
package routes

import (
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	ProfileRoutes(app)
	AuthRoutes(app)
	EditorRoutes(app)
}
