package routes

import (
	"github.com/asthmatick1dd0/CVagg/internal/handlers"
	"github.com/gofiber/fiber/v2"
)

func AuthRoutes(app *fiber.App) {
	api := app.Group("/api")
	v1 := api.Group("/v1")

	// /api/v1/auth/....
	auth := v1.Group("/auth")

	auth.Get("/signin", func(c *fiber.Ctx) error {
		return c.SendString("login route")
	})

	auth.Post("/signup", handlers.SignUpHandler)

	auth.Post("/logout", func(c *fiber.Ctx) error {
		return c.SendString("logout route")
	})

	auth.Post("/forgot-password", func(c *fiber.Ctx) error {
		return c.SendString("forgot-password route")
	})

	auth.Get("/refresh", func(c *fiber.Ctx) error {
		return c.SendString("refresh route")
	})

	auth.Get("/me", func(c *fiber.Ctx) error {
		return c.SendString("me route")
	})
}
