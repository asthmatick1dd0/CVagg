package service

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
)

type resumeService struct {
	repo  repository.ResumeRepository
	rItem ResumeItemService
}

func NewResumeService(r repository.ResumeRepository) *resumeService {
	return &resumeService{repo: r}
}

func (s *resumeService) Create(input *input.ResumeInput) error {

	resume := &models.Resume{
		Title:  input.Title,
		UserId: input.UserID,
		Items:  input.Items,
	}
	return s.repo.Create(resume)
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
