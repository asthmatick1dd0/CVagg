package handlers

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/parsing"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/asthmatick1dd0/CVagg/internal/transport"
	internal "github.com/asthmatick1dd0/CVagg/internal/validation"
	"github.com/gofiber/fiber/v2"
)

func SignUpHandler(c *fiber.Ctx) error {
	var input transport.SignUpInput
	err := parsing.QueryParser(&input, c.Queries())
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(err)
	}
	errs := internal.ValidateStruct(input)
	if len(errs) != 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}
	repo := c.Locals("userRepo").(repository.UserRepository)
	var user models.User
	user.Email = input.Email
	user.Username = input.Username
	//TODO: Прохешировать пароль перед тем как ложить его куда-либо
	user.PasswordHash = input.Password
	if err := repo.Create(&user); err != nil {
		return c.Status(fiber.StatusInsufficientStorage).JSON(err)
	}
	return c.Status(fiber.StatusAccepted).JSON(input)
}
