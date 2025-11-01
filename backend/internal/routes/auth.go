package routes

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/parsing"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/asthmatick1dd0/CVagg/internal/transport"
	internal "github.com/asthmatick1dd0/CVagg/internal/validation"
	"github.com/gofiber/fiber/v2"
)

func AuthRoutes(app *fiber.App, r repository.UserRepository) {
	api := app.Group("/api")
	v1 := api.Group("/v1")

	// /api/v1/auth/....
	auth := v1.Group("/auth")

	auth.Get("/signin", func(c *fiber.Ctx) error {
		return c.SendString("login route")
	})

	auth.Post("/signup", func(c *fiber.Ctx) error {
		//TODO: Присылать на клиент что-то более информативное в случае ошибки
		var input transport.SignUpInput
		if err := parsing.QueryParser(&input, c.Queries()); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON("can't parse ur stuff")
		}
		errs := internal.ValidateStruct(input)
		if len(errs) != 0 {
			return c.Status(fiber.StatusBadRequest).JSON(errs)
		}
		var user models.User
		user.Email = input.Email
		user.Username = input.Username
		//TODO: Прохешировать пароль перед тем как ложить его куда-либо
		user.PasswordHash = input.Password
		if err := r.Create(&user); err != nil {
			return c.Status(fiber.StatusInsufficientStorage).JSON(err)
		}
		return c.Status(fiber.StatusAccepted).JSON(input)
	})

	auth.Post("/logout", func(c *fiber.Ctx) error {
		return c.SendString("logout route")
	})

	auth.Post("/forgot-password", func(c *fiber.Ctx) error {
		return c.SendString("forgot-password route")
	})

	auth.Get("/refresh", func(c *fiber.Ctx) error {
		return c.SendString("refresh route")
	})

	auth.Get("/me", func(c *fiber.Ctx) error {
		return c.SendString("me route")
	})
}
