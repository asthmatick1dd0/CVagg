package main

import (
	"log"

	"github.com/asthmatick1dd0/CVagg/internal/database"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/asthmatick1dd0/CVagg/internal/routes"
	"github.com/gofiber/fiber/v2"
)

func main() {
	// Connect to DB (this will also run AutoMigrate in ConnectDB)
	db, err := database.ConnectDB()
	if err != nil {
		log.Fatalf("failed to connect to DB: %v", err)
	}

	app := fiber.New()

	routes.SetupRoutes(app, repository.NewUserRepository(db))

	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
