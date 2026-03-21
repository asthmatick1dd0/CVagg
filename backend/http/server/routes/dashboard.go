package routes

import (
	"github.com/asthmatick1dd0/CVagg/internal/modules/dashboard"
	"github.com/gofiber/fiber/v2"
)

func DashboardGroup(r fiber.Router, dashboardHandler dashboard.Handler) {
	dashboardRoutes := r.Group("/dashboard")
	dashboardRoutes.Get("/resumes", dashboardHandler.GetAllByUserID)
	dashboardRoutes.Get("/resumes/:id", dashboardHandler.GetByID)
	dashboardRoutes.Delete("/resumes/:id", dashboardHandler.Delete)
}
