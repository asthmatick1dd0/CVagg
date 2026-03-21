package routes

import (
	"github.com/asthmatick1dd0/CVagg/internal/modules/editor"
	"github.com/gofiber/fiber/v2"
)

func EditorGroup(r fiber.Router, editorHandler editor.Handler) {
	editorRoutes := r.Group("/editor")
	editorRoutes.Post("/resume", editorHandler.CreateResume)
	editorRoutes.Get("/resume/:id", editorHandler.GetResumeByID)
	editorRoutes.Get("/resume/:id/export", editorHandler.ExportResumePDF)
}
