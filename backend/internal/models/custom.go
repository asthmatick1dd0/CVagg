package models

import (
	"gorm.io/gorm"
)

type Custom struct {
	gorm.Model
	Resume  Resume `json:"resume"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Item
}
