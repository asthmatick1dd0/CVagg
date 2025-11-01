package models

import (
	"gorm.io/gorm"
)

type HardSkill struct {
	gorm.Model
	SkillId uint `json:"skill_id"`
	Item
}
