package models

import (
	"gorm.io/gorm"
)

type About struct {
	gorm.Model
	About string `json:"about"`
	Item
}
