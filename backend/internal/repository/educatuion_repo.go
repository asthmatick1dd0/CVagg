package repository

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"gorm.io/gorm"
)

type EducationRepository interface {
	ResumeItemRepository[models.Education]
}

func NewEducationRepository(db *gorm.DB) EducationRepository {
	return NewResumeItemRepository[models.Education](db)
}
