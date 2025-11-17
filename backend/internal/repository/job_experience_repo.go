package repository

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"gorm.io/gorm"
)

type JobExperienceRepository interface {
	ResumeItemRepository[models.JobExperience]
}

func NewJobExperienceRepository(db *gorm.DB) JobExperienceRepository {
	return NewResumeItemRepository[models.JobExperience](db)
}
