package editor

import (
	"fmt"
	"log"
	"strconv"

	"github.com/asthmatick1dd0/CVagg/internal/modules/user/entity/auth"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/asthmatick1dd0/CVagg/pkg/adapters/llm"
	"github.com/asthmatick1dd0/CVagg/pkg/adapters/llm/model"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
	"github.com/asthmatick1dd0/CVagg/pkg/http/resp"
	"github.com/gofiber/fiber/v2"
)

type Handler interface {
	CreateResume(ctx *fiber.Ctx) error
	GetResumeByID(ctx *fiber.Ctx) error
	ExportResumePDF(ctx *fiber.Ctx) error
	Analyze(ctx *fiber.Ctx) error
	UpdateResume(ctx *fiber.Ctx) error
}

type handler struct {
	s        Service
	aiClient llm.LLMClient
}

func NewHandler(s Service, llm llm.LLMClient) Handler {
	return &handler{
		s:        s,
		aiClient: llm,
	}
}

func (h *handler) CreateResume(ctx *fiber.Ctx) error {
	var input input.ResumeInput
	if err := ctx.BodyParser(&input); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	userID := auth.UserIDFromCookie(ctx)
	if userID != input.UserID {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "trying to get another user's resume"})
	}

	err := h.s.SaveResume(nil, &input)
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

	resume, err := h.s.GetResumeByID(nil, uint(ID64))
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "no such resume"})
	}

	userID := auth.UserIDFromCookie(ctx)
	if userID != resume.UserID {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "trying to get another user's resume"})
	}

	return ctx.JSON(resume)
}

func (h *handler) ExportResumePDF(ctx *fiber.Ctx) error {
	idStr := ctx.Params("id")
	id64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	// resume, err := h.s.GetResumeByID(nil, uint(id64))
	// if err != nil {
	// 	return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	// }
	// userID := auth.UserIDFromCookie(ctx)
	// if userID != resume.UserID {
	// 	return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "trying to export another user's resume"})
	// }

	b, err := h.s.ExportResumePDF(nil, uint(id64))
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

func (h *handler) Analyze(ctx *fiber.Ctx) error {
	var req model.Request

	if err := ctx.BodyParser(&req); err != nil {
		log.Printf("[editor:analyze] body parse failed: %v", err)
		// TODO: добавить новые ошибки и заменить этот ужас мне просто лень
		return resp.HandleError(ctx, cvaggerr.ErrorValidation())
	}

	log.Printf("[editor:analyze] request mode=%q has_resume=%t has_field=%t question_len=%d", req.Mode, req.Resume != nil, req.Field != nil, len(req.Question))

	res, err := h.aiClient.Chat(ctx.Context(), req)
	if err != nil {
		log.Printf("[editor:analyze] llm chat failed: %v", err)
		// TODO: этот ужас тоже поменять иначе я повешусь
		return resp.HandleError(ctx, cvaggerr.ErrorInternalServer())
	}

	return resp.HandleSuccess(ctx, res)
}

func (h *handler) UpdateResume(ctx *fiber.Ctx) error {
	var input input.ResumeInput
	if err := ctx.BodyParser(&input); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	userID := auth.UserIDFromCookie(ctx)
	if userID != input.UserID {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "trying to update another user's resume"})
	}

	err := h.s.UpdateResume(nil, &input)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal server error"})
	}
	return nil
}
