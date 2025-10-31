package repository

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"gorm.io/gorm"
)

type HardSkillRepository interface {
	ResumeItemRepository[models.HardSkill]
}

func NewHardSkillRepository(db *gorm.DB) HardSkillRepository {
	return NewResumeItemRepository[models.HardSkill](db)
}
