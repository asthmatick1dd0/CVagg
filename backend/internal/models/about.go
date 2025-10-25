package models

import (
	"gorm.io/gorm"
)

type About struct {
	gorm.Model
	ResumeId uint   `json:"resume_id"`
	Field    string `json:"field"`
	About    string `json:"about"`
}
