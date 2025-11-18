package models

import (
	"gorm.io/gorm"
)

type Resume struct {
	gorm.Model
	Title string `json:"title"`

	UserID uint `gorm:"not null;index" json:"user_id"`
	User   User `json:"user"`
}
