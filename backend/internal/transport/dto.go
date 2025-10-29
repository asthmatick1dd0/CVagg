package transport

import (
	"time"
)

type UserResponse struct { // это пихать на фронт, валидировать и хранить локально в памяти для каждого юзверя
	Username  string    `json:"name,omitempty"`
	Email     string    `json:"email,omitempty"`
	ExpiresAt time.Time `json:"expires_at"` // мб потом будет не нужно
	UpdatedAt time.Time `json:"updated_at"`
	CreatedAt time.Time `json:"created_at"`
}
