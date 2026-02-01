package editor

import (
	"fmt"
	"strconv"

	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/gofiber/fiber/v2"
)

type Handler interface {
	CreateResume(ctx *fiber.Ctx) error
	GetResumeByID(ctx *fiber.Ctx) error
	ExportResumePDF(ctx *fiber.Ctx) error
}

type handler struct {
	s Service
}

func NewHandler(s Service) Handler {
	return &handler{s: s}
}

func (h *handler) CreateResume(ctx *fiber.Ctx) error {
	var input input.ResumeInput
	if err := ctx.BodyParser(&input); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	err := h.s.SaveResume(&input)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal server error"})
	}
	return nil
}

func (h *handler) GetResumeByID(ctx *fiber.Ctx) error {
	IDstr := ctx.Params("id")
	ID64, err := strconv.ParseUint(IDstr, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	resume, err := h.s.GetResumeByID(uint(ID64))
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "no such resume"})
	}
	return ctx.JSON(resume)
}

func (h *handler) ExportResumePDF(ctx *fiber.Ctx) error {
	idStr := ctx.Params("id")
	id64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	b, err := h.s.ExportResumePDF(uint(id64))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	ctx.Response().Header.Set("Content-Type", "application/pdf")
	ctx.Response().Header.Set("Content-Disposition", fmt.Sprintf("attachment; filename=resume-%d.pdf", id64))
	if _, err := ctx.Response().BodyWriter().Write(b); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to write pdf"})
	}
	return nil
}
