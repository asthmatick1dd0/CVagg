package routes

import (
	"github.com/gofiber/fiber/v2"
)

func ProfileRoutes(app *fiber.App) {

	api := app.Group("/api")
	v1 := api.Group("/v1")

	// /api/v1/profile/...
	profile := v1.Group("/profile")

	// TODO: Implement handler
	profile.Get("/me", func(c *fiber.Ctx) error {
		return c.SendString("User Profile")
	})

	// /api/v1/profile/resumes/...
	resumes := profile.Group("/resumes")

	// TODO: Implement handler
	resumes.Get("", func(c *fiber.Ctx) error {
		return c.SendString("User resumes")
	})

	// TODO: Implement handler
	resumes.Get("/:id/export", func(c *fiber.Ctx) error {
		return c.SendString("User resumes export by id")
	})

	// TODO: Implement handler
	resumes.Delete("/:id/delete", func(c *fiber.Ctx) error {
		return c.SendString("User resumes delete by id")
	})

	// /api/v1/profile/settings/...
	settings := profile.Group("/settings")

	// TODO: Implement handler
	settings.Patch("/change-avatar", func(c *fiber.Ctx) error {
		return c.SendString("Change user avatar")
	})

	// TODO: Implement handler
	settings.Patch("/change-username", func(c *fiber.Ctx) error {
		return c.SendString("Change user username")
	})

	// TODO: Implement handler
	settings.Patch("/change-email", func(c *fiber.Ctx) error {
		return c.SendString("Change user email")
	})

	// TODO: Implement handler
	settings.Patch("/change-password", func(c *fiber.Ctx) error {
		return c.SendString("Change user password")
	})

	// TODO: Implement handler
	settings.Post("/save-changes", func(c *fiber.Ctx) error {
		return c.SendString("Save changes")
	})
}
