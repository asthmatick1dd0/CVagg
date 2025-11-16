package handlers

import (
	"strconv"

	"github.com/asthmatick1dd0/CVagg/internal/service"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/gofiber/fiber/v2"
)

type ProfileHandler interface {
	Create(c *fiber.Ctx) error
	Update(c *fiber.Ctx) error
	Delete(c *fiber.Ctx) error
	GetByID(c *fiber.Ctx) error
	GetAllByUserID(c *fiber.Ctx) error
}

type profileHandler struct {
	s service.ResumeService
}

func NewProfileHandler(s *service.ResumeService) ProfileHandler {
	return &profileHandler{s}
}

// TODO [CVAGG-42]: написать middleware для аутентификации и реализовать передачу id через локалс. + убрать логику из хендлера👿
func parseUserID(c *fiber.Ctx) uint {
	if val := c.Get("X-User-Id"); val != "" {
		if id, err := strconv.Atoi(val); err == nil {
			return uint(id)
		}
	}
	if val := c.Query("user_id"); val != "" {
		if id, err := strconv.Atoi(val); err == nil {
			return uint(id)
		}
	}
	return 0
}

// TODO [CVAGG-41]: Добавить внедрение зависимостей через структуру хенделера!№!№!№!№!№!№!)))(;(;()))
func (h *profileHandler) Create(c *fiber.Ctx) error {
	var input input.ResumeInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "can't parse data to structure"})
	}

	if err := h.s.Create(&input); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal error while creating resume"})
	}
}

func GetByUserId(c *fiber.Ctx) error {
	userID := parseUserID(c)
	if userID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "missing user_id (query or X-User-Id header)"})
	}

	v := c.Locals("resumeService")
	if v == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "resumeService not configured"})
	}
	svc, ok := v.(service.ResumeService)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "resumeService has wrong type"})
	}

	resumes, err := svc.GetAllByUserID(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(resumes)
}

func GetById(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	v := c.Locals("resumeService")
	if v == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "resumeService not configured"})
	}
	svc, ok := v.(service.ResumeService)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "resumeService has wrong type"})
	}

	resume, err := svc.GetByID(uint(id64))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(resume)
}

func Update(c *fiber.Ctx) error {
	var input input.ResumeInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "can't parse data to structure"})
	}

	if err := h.s.Update(&input); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal error while creating resume"})
	}
}

func Delete(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	v := c.Locals("resumeService")
	if v == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "resumeService not configured"})
	}
	svc, ok := v.(service.ResumeService)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "resumeService has wrong type"})
	}

	if err := svc.Delete(uint(id64)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
