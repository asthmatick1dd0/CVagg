package routes

import (
	"github.com/asthmatick1dd0/CVagg/internal/container"
	"github.com/asthmatick1dd0/CVagg/internal/service"
	"github.com/gofiber/fiber/v2"
)

func AuthRoutes(app *fiber.App, cont *container.Container) {
	api := app.Group("/api")
	v1 := api.Group("/v1")

	// /api/v1/auth/....
	auth := v1.Group("/auth")

	auth.Get("/signin", cont.AuthHandler.SignIn)

	auth.Post("/signup", cont.AuthHandler.SignUp)

	auth.Post("/logout", service.DeserealizeUser, cont.AuthHandler.LogOut)

	auth.Post("/forgot-password", func(c *fiber.Ctx) error {
		return c.SendString("forgot-password route")
	})

	auth.Get("/refresh", func(c *fiber.Ctx) error {
		return c.SendString("refresh route")
	})

	auth.Get("/me", service.DeserealizeUser, cont.AuthHandler.Me)
}
