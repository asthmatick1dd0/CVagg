package handlers

import (
	"strconv"

	"github.com/asthmatick1dd0/CVagg/internal/service"
	"github.com/gofiber/fiber/v2"
)

type DashboardHandler interface {
	GetAllByUserID(c *fiber.Ctx) error
	GetByID(c *fiber.Ctx) error
	Delete(c *fiber.Ctx) error
}

type dashboardHandler struct {
	s service.DashboardService
}

func NewDashboardHandler(s service.DashboardService) DashboardHandler {
	return &dashboardHandler{s: s}
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

func (h *dashboardHandler) GetAllByUserID(c *fiber.Ctx) error {
	userID := parseUserID(c)
	if userID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "missing user_id (query or X-User-Id header)"})
	}

	resumes, err := h.s.GetAllByUserID(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(resumes)
}

func (h *dashboardHandler) GetByID(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	resume, err := h.s.GetByID(uint(id64))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(resume)
}

func (h *dashboardHandler) Delete(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	if err := h.s.Delete(uint(id64)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
