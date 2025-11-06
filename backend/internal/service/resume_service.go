package service

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
)

type ResumeService interface {
	Create(userID uint, title string) (*models.Resume, error)
	GetByUserId(userID uint) ([]models.Resume, error)
	GetById(id uint) (*models.Resume, error)
	Update(resume *models.Resume) error
	Delete(id uint) error
}

type resumeService struct {
	repo repository.ResumeRepository
}

func NewResumeService(r repository.ResumeRepository) ResumeService {
	return &resumeService{repo: r}
}

func (s *resumeService) Create(userID uint, title string) (*models.Resume, error) {
	resume := &models.Resume{
		Title:  title,
		UserId: userID,
		Items:  []models.ResumeItem{},
	}
	if err := s.repo.Create(resume); err != nil {
		return nil, err
	}
	return resume, nil
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
