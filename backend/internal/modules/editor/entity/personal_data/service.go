package personal_data

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
	"gorm.io/gorm"
)

type PersonalDataService interface {
	SaveResumePersonalData(tx *gorm.DB, resume *input.PersonalDataInput) cvaggerr.Error
}

type personalDataService struct {
	repo Repository
}

func NewPersonalDataService(repo Repository) PersonalDataService {
	return &personalDataService{
		repo: repo,
	}
}

func (s *personalDataService) SaveResumePersonalData(tx *gorm.DB, resume *input.PersonalDataInput) cvaggerr.Error {
	personalDataModel := &models.PersonalData{
		DesiredJob: resume.DesiredJob,
		FullName:   resume.FullName,
		Email:      resume.Email,
		Phone:      resume.Phone,
		Address:    resume.Address,
	}

	return s.repo.Create(tx, personalDataModel)
}
