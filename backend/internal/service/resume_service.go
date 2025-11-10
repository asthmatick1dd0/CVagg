package service

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
)

type resumeService struct {
	repo repository.ResumeRepository
}

func NewResumeService(r repository.ResumeRepository) *resumeService {
	return &resumeService{repo: r}
}

func (s *resumeService) Create(input *input.ResumeInput) (*models.Resume, error) {
	resume := &models.Resume{
		Title:   input.Title,
		UserId:  input.UserID,
		Summary: input.Summary,
		Items:   input.Items,
	}
}

func (s *resumeService) GetByUserId(userID uint) ([]models.Resume, error) {
	return s.repo.GetByUserId(userID)
}

func (s *resumeService) GetById(userID uint) (*models.Resume, error) {
	return s.repo.GetById(userID)
}

func (s *resumeService) Update(resume *models.Resume) error {
	return s.repo.Update(resume)
}

func (s *resumeService) Delete(id uint) error {
	return s.repo.Delete(id)
}
