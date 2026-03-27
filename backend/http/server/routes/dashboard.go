package routes

import (
	"github.com/asthmatick1dd0/CVagg/internal/modules/dashboard"
	"github.com/asthmatick1dd0/CVagg/internal/modules/user/entity/auth"
	"github.com/gofiber/fiber/v2"
)

func DashboardGroup(r fiber.Router, dashboardHandler dashboard.Handler) {
	dashboardRoutes := r.Group("/dashboard")
	dashboardRoutes.Get("/resumes", auth.IsAuthorized, dashboardHandler.GetAllByUserID)
	dashboardRoutes.Get("/resumes/:id", auth.IsAuthorized, dashboardHandler.GetByID)
	dashboardRoutes.Delete("/resumes/:id", auth.IsAuthorized, dashboardHandler.Delete)
}
