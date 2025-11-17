package repository

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"gorm.io/gorm"
)

type CustomRepository interface {
	ResumeItemRepository[models.Custom]
}

func NewCustomRepository(db *gorm.DB) CustomRepository {
	return NewResumeItemRepository[models.Custom](db)
}
