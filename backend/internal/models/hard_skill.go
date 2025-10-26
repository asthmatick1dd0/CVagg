package models

import (
	"gorm.io/gorm"
)

type HardSkill struct {
	gorm.Model
	ResumeId uint   `json:"resume_id"`
	Resume   Resume `json:"resume"`
	Field    string `json:"field"`
	SkillId  uint   `json:"skill_id"`
}
