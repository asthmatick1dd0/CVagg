package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username     string   `gorm:"uniqueIndex;size:100" json:"username"`
	Email        string   `gorm:"uniqueIndex;size:100" json:"email"`
	PasswordHash string   `json:"-"`
	Resume       []Resume `gorm:"foreignKey:UserId" json:"resumes"`
}

type SignUpInput struct {
	Username string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type SignInInputUsername struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type SignInInputEmail struct {
	Email    string `json:"email" validate:"required"`
	Password string `json:"password" validate:"required"`
} // чтобы потом у юзверя был выбор - логиниться через почту или юз

type UserResponse struct { // это пихать на фронт, валидировать и хранить локально в памяти для каждого юзверя
	Username  string    `json:"name,omitempty"`
	Email     string    `json:"email,omitempty"`
	ExpiresAt time.Time `json:"expires_at"` // мб потом будет не нужно
	UpdatedAt time.Time `json:"updated_at"`
	CreatedAt time.Time `json:"created_at"`
}
