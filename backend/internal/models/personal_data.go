package models

import (
	"time"

	"gorm.io/gorm"
)

type PersonalData struct {
	gorm.Model
	DesiredJob string     `json:"desired_job"`
	FullName   string     `json:"full_name"`
	Email      string     `json:"email"`
	Phone      string     `json:"phone"`
	Address    string     `json:"address"`
	BirthDate  *time.Time `json:"birth_date"`
	Website    *string    `json:"website"`
	GitHub     *string    `json:"github"`
}
