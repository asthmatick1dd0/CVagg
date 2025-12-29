package routes

import (
	"github.com/asthmatick1dd0/CVagg/auth"
	"github.com/asthmatick1dd0/CVagg/internal/container"
	"github.com/gofiber/fiber/v2"
)

func DashboardRoutes(app *fiber.App, cont *container.Container) {
	api := app.Group("/api")
	v1 := api.Group("/v1")

	// /api/v1/dashboard/...
	dashboard := v1.Group("/dashboard")

	dashboard.Get("/me", func(c *fiber.Ctx) error {
		return c.SendString("User Profile")
	})

	// /api/v1/dashboard/resumes/...
	resumes := dashboard.Group("/resumes")

	// Get all resumes for user
	resumes.Get("", auth.DeserealizeUser, cont.DashboardHandler.GetAllByUserID)

	// Get resume by id
	resumes.Get("/:id", auth.DeserealizeUser, cont.DashboardHandler.GetByID)

	// Delete resume by id
	resumes.Delete("/:id", auth.DeserealizeUser, cont.DashboardHandler.Delete)

	// /api/v1/profile/settings/...
	settings := dashboard.Group("/settings")

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
