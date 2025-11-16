package handlers

import (
	"github.com/asthmatick1dd0/CVagg/internal/service"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/gofiber/fiber/v2"
)

// TODO [CVAGG-43] Переписать все хендлеры с использованием service, а не Locals
type editorHandler struct {
	service *service.EditorService
}

func NewEditorHandler(service *service.EditorService) *editorHandler {
	return &editorHandler{service}
}

func (h *editorHandler) CreateResume(ctx *fiber.Ctx) error {
	// TODO [CVAGG-40]: надо переписать нормально и переформировать папку transport
	var input input.ResumeInput
	if err := ctx.BodyParser(&input); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	resume, err := h.service.Create(&input)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal server error"})
	}
	return ctx.Status(fiber.StatusCreated).JSON(resume)
}
