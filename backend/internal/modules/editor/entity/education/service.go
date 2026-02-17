package education

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
	"gorm.io/gorm"
)

type EducationService interface {
	SaveResumeEducation(tx *gorm.DB, resume *input.EducationInput) cvaggerr.Error
}

type educationService struct {
	repo Repository
}

func NewEducationService(repo Repository) EducationService {
	return &educationService{
		repo: repo,
	}
}

func (s *educationService) SaveResumeEducation(tx *gorm.DB, resume *input.EducationInput) cvaggerr.Error {
	educationModel := &models.Education{
		University: resume.University,
		Faculty:    resume.Faculty,
		Degree:     resume.Degree,
		Major:      resume.Major,
		StartDate:  resume.StartDate,
		EndDate:    resume.EndDate,
		Finished:   resume.Finished,
	}

	return s.repo.Create(tx, educationModel)
}
