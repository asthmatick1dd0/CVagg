package repository

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"gorm.io/gorm"
)

type PersonalDataRepository interface {
	ResumeItemRepository[models.PersonalData]
}

func NewPersonalDataRepository(db *gorm.DB) PersonalDataRepository {
	return NewResumeItemRepository[models.PersonalData](db)
}
