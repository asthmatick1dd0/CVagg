package dashboard

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Handler interface {
	GetAllByUserID(c *fiber.Ctx) error
	GetByID(c *fiber.Ctx) error
	Delete(c *fiber.Ctx) error
}

type handler struct {
	dashboardService Service
}

func NewHandler(dashboardService Service) Handler {
	return &handler{dashboardService: dashboardService}
}

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

func (h *handler) GetAllByUserID(c *fiber.Ctx) error {
	userID := parseUserID(c)
	if userID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "missing user_id (query or X-User-Id header)"})
	}

	resumes, err := h.dashboardService.GetAllByUserID(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(resumes)
}

func (h *handler) GetByID(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	resume, err := h.dashboardService.GetByID(uint(id64))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(resume)
}

func (h *handler) Delete(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	if err := h.dashboardService.Delete(nil, uint(id64)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
