package main

import (
	"github.com/asthmatick1dd0/CVagg/internal/routes"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	routes.SetupRoutes(app)

	app.Listen(":8080")
}
