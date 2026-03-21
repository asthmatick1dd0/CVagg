package custom

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
	"gorm.io/gorm"
)

type CustomService interface {
	SaveResumeCustom(tx *gorm.DB, resume *input.CustomInput) cvaggerr.Error
}

type customService struct {
	repo Repository
}

func NewCustomService(repo Repository) CustomService {
	return &customService{
		repo: repo,
	}
}

func (s *customService) SaveResumeCustom(tx *gorm.DB, resume *input.CustomInput) cvaggerr.Error {
	customModel := &models.Custom{
		Title:   resume.Title,
		Content: resume.Content,
	}

	return s.repo.Create(tx, customModel, "resume_item.custom")
}
