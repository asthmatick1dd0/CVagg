package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username     string `gorm:"uniqueIndex;size:100" json:"username"`
	Email        string `gorm:"uniqueIndex;size:100" json:"email"`
	PasswordHash string `json:"-"`
}
