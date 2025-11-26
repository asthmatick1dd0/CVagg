package handlers

import (
	"github.com/asthmatick1dd0/CVagg/internal/service"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/gofiber/fiber/v2"
)

type EditorHandler interface {
	CreateResume(ctx *fiber.Ctx) error
}

type editorHandler struct {
	s service.EditorService
}

// TODO [CVAGG-47]: Дописать сервис для редактора
func NewEditorHandler(s service.EditorService) EditorHandler {
	return &editorHandler{s: s}
}

func (h *editorHandler) CreateResume(ctx *fiber.Ctx) error {
	var input input.ResumeInput
	if err := ctx.BodyParser(&input); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	if err := h.s.SaveResume(&input); err != nil {
		// возвращаем ошибку Fiber, чтобы статус реально был 500
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// успешный кейс
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"status": "ok"})
}