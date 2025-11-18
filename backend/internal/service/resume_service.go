package service

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
)

type ResumeService interface {
	Create(input *input.ResumeInput) error
	Update(resume *input.ResumeInput) error
	Delete(id uint) error
	GetByID(id uint) (*models.Resume, error)
	GetAllByUserID(id uint) ([]*models.Resume, error)
}

type resumeService struct {
	repo  repository.ResumeRepository
	rItem ItemService
}

func NewResumeService(r repository.ResumeRepository) ResumeService {
	return &resumeService{repo: r}
}

func (s *resumeService) Create(input *input.ResumeInput) error {

	resume := &models.Resume{
		Title:  input.Title,
		UserId: input.UserID,
	}

	s.rItem.Create(input)

	return s.repo.Create(resume)
}

func (s *resumeService) GetAllByUserID(userID uint) ([]*models.Resume, error) {
	return s.repo.GetAllByUserID(userID)
}

func (s *resumeService) GetByID(userID uint) (*models.Resume, error) {
	return s.repo.GetById(userID)
}

func (s *resumeService) Update(resume *input.ResumeInput) error {
	return s.repo.Update(resume)
}

func (s *resumeService) Delete(id uint) error {
	return s.repo.Delete(id)
}
