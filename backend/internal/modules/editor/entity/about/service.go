package about

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
	"gorm.io/gorm"
)

type AboutService interface {
	SaveResumeAbout(tx *gorm.DB, resume *input.AboutInput) cvaggerr.Error
}

type aboutService struct {
	repo Repository
}

func NewAboutService(repo Repository) AboutService {
	return &aboutService{
		repo: repo,
	}
}

func (s *aboutService) SaveResumeAbout(tx *gorm.DB, resume *input.AboutInput) cvaggerr.Error {
	aboutModel := &models.About{
		About: resume.About,
	}

	return s.repo.Create(tx, aboutModel)
}
