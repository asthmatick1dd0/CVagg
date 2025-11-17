package models

import (
	"gorm.io/gorm"
)

type Resume struct {
	gorm.Model
	Title string `json:"title"`

	UserId uint `gorm:"not null;index" json:"user_id"`
	User   User `json:"user"`

	Items []ResumeItem `json:"resume_item"`
}
