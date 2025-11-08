package handlers

import (
	"strconv"

	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/service"
	"github.com/gofiber/fiber/v2"
)

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

func Create(c *fiber.Ctx) error {
	var body struct {
		Title string `json:"title"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid body"})
	}

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

	resume, err := svc.Create(userID, body.Title)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(resume)
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

	resumes, err := svc.GetByUserId(userID)
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

	resume, err := svc.GetById(uint(id64))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(resume)
}

func Update(c *fiber.Ctx) error {
	var body models.Resume

	if err := c.BodyParser(&body); err != nil {
		c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid body"})
	}

	v := c.Locals("resumeService")
	if v == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "resumeService not configured"})
	}
	svc, ok := v.(service.ResumeService)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "resumeService has wrong type"})
	}

	if err := svc.Update(&body); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(body)
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
