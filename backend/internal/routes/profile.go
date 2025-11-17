package routes

import (
	"log"

	"github.com/asthmatick1dd0/CVagg/internal/database"
	"github.com/asthmatick1dd0/CVagg/internal/handlers"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/asthmatick1dd0/CVagg/internal/service"
	"github.com/gofiber/fiber/v2"
)

func ProfileRoutes(app *fiber.App) {

	db, err := database.ConnectDB()
	if err != nil {
		log.Fatalf("failed to connect to DB: %v", err)
	}

	hand := handlers.NewProfileHandler(service.NewResumeService(repository.NewResumeRepository(db)))

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
	resumes.Post("", hand.Create)

	// Get all resumes for user
	resumes.Get("", hand.GetAllByUserID)

	// Update resume
	resumes.Patch("/:id", hand.Update)

	// Get resume by id
	resumes.Get("/:id", hand.GetByID)

	// Delete resume by id
	resumes.Delete("/:id", hand.Delete)

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
