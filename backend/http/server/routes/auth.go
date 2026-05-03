package routes

import (
	"github.com/asthmatick1dd0/CVagg/internal/modules/user/entity/auth"
	"github.com/gofiber/fiber/v2"
)

func AuthGroup(r fiber.Router, authHandler auth.Handler) {
	authRoutes := r.Group("/auth")
	authRoutes.Post("/signup", authHandler.SignUp)
	authRoutes.Get("/verify", authHandler.Verify)
	authRoutes.Get("/signin", authHandler.SignIn)
	authRoutes.Post("/logout", authHandler.LogOut)
	authRoutes.Get("/me", authHandler.Me)
}
