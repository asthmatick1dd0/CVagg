package models

import (
	"time"

	"gorm.io/gorm"
)

type JobExperience struct {
	gorm.Model
	Company     string     `json:"company"`
	Position    string     `json:"position"`
	StartDate   *time.Time `json:"start_date"`
	EndDate     *time.Time `json:"end_date"`
	Description string     `json:"description"`
}
