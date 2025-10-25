package models

import (
	"gorm.io/gorm"
)

type Resume struct {
	gorm.Model
	AuthorId   uint         `json:"author_id"`
	Title      string       `json:"title"`
	UserId     uint         `json:"user_id"`
	User       User         `json:"user"`
	ResumeItem []ResumeItem `json:"resume_item"`
}
