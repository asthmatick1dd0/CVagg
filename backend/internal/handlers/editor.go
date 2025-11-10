package handlers

import (
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/asthmatick1dd0/CVagg/service"
	"github.com/gofiber/fiber/v2"
)

type EditorHandler struct {
	service *service.EditorService
}

func NewEditorHandler(service *service.EditorService) *EditorHandler {
	return &EditorHandler{service}
}

func (h *EditorHandler) SaveResume(ctx *fiber.Ctx) error {
	// TODO(CVAGG-40): надо переписать нормально и переформировать папку transport
	var input input.ResumeInput
	if err := ctx.BodyParser(&input); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	resume, err := h.service.SaveResume(&input)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal server error"})
	}
	return ctx.Status(fiber.StatusCreated).JSON(resume)
}
