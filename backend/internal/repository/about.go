package repository

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"gorm.io/gorm"
)

type AboutRepository interface {
	ResumeItemRepository[models.About]
}

func NewAboutRepository(db *gorm.DB) AboutRepository {
	return NewResumeItemRepository[models.About](db)
}
