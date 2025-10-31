package repository

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"gorm.io/gorm"
)

type ItemRepository interface {
	ResumeItemRepository[models.ResumeItem]
}

func NewItemRepository(db *gorm.DB) ItemRepository {
	return NewResumeItemRepository[models.ResumeItem](db)
}
