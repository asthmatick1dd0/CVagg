package main

import (
	"fmt"

	database "github.com/asthmatick1dd0/CVagg/pkg/adapters"
	"github.com/asthmatick1dd0/CVagg/pkg/config"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggtx"
	"go.uber.org/zap"
)

func main() {
	conf := config.NewConfig()
	log := cvagglog.NewLogger(conf)
	db := database.New(conf, log)
	cvaggtx.New(db)

	app, cleanup, err := newApp(conf, log, db)
	if err != nil {
		log.Panic(err.Error())
	}
	defer cleanup()

	port := conf.GetString("HTTP_PORT")
	if port == "" {
		port = "8080"
	}

	log.Info("CVagg server starting", zap.String("port", port))

	if err := app.Fiber.Listen(":" + port); err != nil {
		log.Fatal(fmt.Sprintf("Server error: %v", err))
	}
}
