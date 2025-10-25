package models

import (
	"gorm.io/gorm"
)

type ResumesItems struct {
	gorm.Model
	ResumeId  uint   `json:"resume_id"`
	FieldId   uint   `json:"field_id"`
	FieldType string `json:"field_type"`
}
