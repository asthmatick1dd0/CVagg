// Package dto for object that transport data
package dto

import (
	"time"
)

type UserResponse struct { // это пихать на фронт, валидировать и хранить локально в памяти для каждого юзверя (но на самом деле можно и по беку рассылать)
	ID        uint      `json:"id,omitempty"`
	Username  string    `json:"name,omitempty"`
	Name      string    `json:"name,omitempty"`
	Surname   string    `json:"surname,omitempty"`
	Email     string    `json:"email,omitempty"`
	ExpiresAt time.Time `json:"expires_at"`
	UpdatedAt time.Time `json:"updated_at"`
	CreatedAt time.Time `json:"created_at"`
}
