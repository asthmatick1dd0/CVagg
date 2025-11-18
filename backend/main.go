package main

import (
	"log"
	"time"

	"github.com/asthmatick1dd0/CVagg/internal/database"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/asthmatick1dd0/CVagg/internal/routes"
	"github.com/asthmatick1dd0/CVagg/internal/service"
	"github.com/gofiber/fiber/v2"
)

func main() {
	// Connect to DB (this will also run AutoMigrate in ConnectDB)
	db, err := database.ConnectDB()
	if err != nil {
		log.Fatalf("failed to connect to DB: %v", err)
	}

	app := fiber.New()

	app.Use(func(c *fiber.Ctx) error {
		c.Locals("resumeService", service.NewDashboardService(repository.NewResumeRepository(db)))
		c.Locals("userRepo", repository.NewUserRepository(db))

		//TODO: Запихать значения, связанные с безопасностью, в .env, и впредь выгружать оттуда
		c.Locals("JWTExpirationTime", time.Hour*12)
		c.Locals("JWTSecret", service.GenerateJWTSecret())
		c.Locals("JWTMaxAge", 1440)

		return c.Next()
	})

	routes.SetupRoutes(app)

	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
