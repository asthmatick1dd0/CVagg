package routes

import (
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, userRep repository.UserRepository) {
	ProfileRoutes(app)
	AuthRoutes(app, userRep)
	EditorRoutes(app)
}
