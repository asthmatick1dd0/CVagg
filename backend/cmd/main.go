package main

import (
	"github.com/asthmatick1dd0/CVagg/internal/routes"
	"github.com/asthmatick1dd0/CVagg/internal/service"
	database "github.com/asthmatick1dd0/CVagg/pkg/adapters/psqldb"
	"github.com/asthmatick1dd0/CVagg/pkg/config"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggtx"
	"github.com/gofiber/fiber/v2"
)

func main() {
	conf := config.NewConfig()
	log := cvagglog.NewLogger(conf)
	db := database.New(conf, log)
	cvaggtx.New(db)

	app, cleanup, err := newApp(conf, db, log)
	app := fiber.New()

	secret := service.GenerateJWTSecret() // Секрет обязательно выносить в отдельную константу, иначе он перегенерируется при каждом вызове ключа из локалс

	routes.SetupRoutes(app)

	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
