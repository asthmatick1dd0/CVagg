package job_experience

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
	"gorm.io/gorm"
)

type JobExperienceService interface {
	SaveResumeJobExperience(tx *gorm.DB, resume *input.JobExperienceInput) cvaggerr.Error
}

type jobExperienceService struct {
	repo Repository
}

func NewJobExperienceService(repo Repository) JobExperienceService {
	return &jobExperienceService{
		repo: repo,
	}
}

func (s *jobExperienceService) SaveResumeJobExperience(tx *gorm.DB, resume *input.JobExperienceInput) cvaggerr.Error {
	jobExperienceModel := &models.JobExperience{
		Company:   resume.Company,
		Position:  resume.Position,
		StartDate: resume.StartDate,
		EndDate:   resume.EndDate,
	}

	return s.repo.Create(tx, jobExperienceModel)
}
