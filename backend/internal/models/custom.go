package models

import (
	"gorm.io/gorm"
)

type Custom struct {
	gorm.Model
	Title   string `json:"title"`
	Content string `json:"content"`
}
