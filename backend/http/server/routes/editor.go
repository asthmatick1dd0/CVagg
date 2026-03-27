package routes

import (
	"github.com/asthmatick1dd0/CVagg/internal/modules/editor"
	"github.com/asthmatick1dd0/CVagg/internal/modules/user/entity/auth"
	"github.com/gofiber/fiber/v2"
)

func EditorGroup(r fiber.Router, editorHandler editor.Handler) {
	editorRoutes := r.Group("/editor")
	editorRoutes.Post("/resume", auth.IsAuthorized, editorHandler.CreateResume)
	editorRoutes.Get("/resume/:id", auth.IsAuthorized, editorHandler.GetResumeByID)
	editorRoutes.Get("/resume/:id/export", auth.IsAuthorized, editorHandler.ExportResumePDF)
	editorRoutes.Post("/resume/:id/analyze", auth.IsAuthorized, editorHandler.Analyze)
	editorRoutes.Patch("/resume/update", auth.IsAuthorized, editorHandler.UpdateResume)
}
