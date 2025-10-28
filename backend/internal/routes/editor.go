package routes

import (
	"github.com/gofiber/fiber/v2"
)

func EditorRoutes(app *fiber.App) {
	api := app.Group("/api")
	v1 := api.Group("/v1")

	// /api/v1/editor/...
	editor := v1.Group("/editor")

	editor.Post("/save", func(c *fiber.Ctx) error {
		return c.SendString("save route")
	})

	editor.Patch("/:id/save", func(c *fiber.Ctx) error {
		return c.SendString("save by id route")
	})

	editor.Get("/hard-skills-catalog", func(c *fiber.Ctx) error {
		return c.SendString("hard skills catalog route")
	})

	editor.Get("/templates-catalog", func(c *fiber.Ctx) error {
		return c.SendString("template catalog route")
	})

	editor.Get("/export", func(c *fiber.Ctx) error {
		return c.SendString("export route")
	})

	editor.Get("/:id/export", func(c *fiber.Ctx) error {
		return c.SendString("export by id route")
	})
}
