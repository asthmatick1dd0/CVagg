package models

import (
	"gorm.io/gorm"
)

type ResumeItem struct {
	gorm.Model
	ItemId   uint   `gorm:"not null;index" json:"item_id"`
	ItemType string `json:"item_type"`

	ResumeId uint   `gorm:"not null;index" json:"resume_id"`
	Resume   Resume `json:"resume"`
}
