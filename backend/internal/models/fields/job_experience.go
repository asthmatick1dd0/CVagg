package models

import (
	"gorm.io/gorm"
)

type JobExperience struct {
	gorm.Model
	ResumeId  uint   `json:"resume_id"`
	Company   string `json:"company"`
	Position  string `json:"position"`
	StartDate uint   `json:"start_date"`
	EndDate   uint   `json:"end_date"`
}
