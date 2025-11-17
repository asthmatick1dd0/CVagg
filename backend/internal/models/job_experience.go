package models

import (
	"gorm.io/gorm"
)

type JobExperience struct {
	gorm.Model
	Company   string `json:"company"`
	Position  string `json:"position"`
	StartDate uint   `json:"start_date"`
	EndDate   uint   `json:"end_date"`
	Item
}
