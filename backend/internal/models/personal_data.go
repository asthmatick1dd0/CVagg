package models

import (
	"gorm.io/gorm"
)

type PersonalData struct {
	gorm.Model
	FullName string `json:"full_name"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Address  string `json:"address"`
}
