package routes

import (
	"github.com/asthmatick1dd0/CVagg/internal/handlers"
	"github.com/gofiber/fiber/v2"
)

func ProfileRoutes(app *fiber.App) {

	api := app.Group("/api")
	v1 := api.Group("/v1")

	// /api/v1/profile/...
	profile := v1.Group("/profile")

	profile.Get("/me", func(c *fiber.Ctx) error {
		return c.SendString("User Profile")
	})

	// /api/v1/profile/resumes/...
	resumes := profile.Group("/resumes")

	// Create new resume
	resumes.Post("", handlers.Create)

	// Get all resumes for user
	resumes.Get("", handlers.GetByUserId)

	// Update resume
	resumes.Patch("/:id", handlers.Update)

	// Get resume by id
	resumes.Get("/:id", handlers.GetById)

	// Delete resume by id
	resumes.Delete("/:id", handlers.Delete)

	// /api/v1/profile/settings/...
	settings := profile.Group("/settings")

	settings.Patch("/change-avatar", func(c *fiber.Ctx) error {
		return c.SendString("Change user avatar")
	})

	settings.Patch("/change-username", func(c *fiber.Ctx) error {
		return c.SendString("Change user username")
	})

	settings.Patch("/change-email", func(c *fiber.Ctx) error {
		return c.SendString("Change user email")
	})

	settings.Patch("/change-password", func(c *fiber.Ctx) error {
		return c.SendString("Change user password")
	})

	settings.Post("/save-changes", func(c *fiber.Ctx) error {
		return c.SendString("Save changes")
	})
}
