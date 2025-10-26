package models

import (
	"gorm.io/gorm"
)

type ResumeItem struct {
	gorm.Model
	FieldId   uint   `json:"field_id"`
	FieldType string `json:"field_type"`
	ResumeId  uint   `json:"resume_id"`
	Resume    Resume `json:"resume"`
}
