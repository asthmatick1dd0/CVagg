package service

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
)

type DashboardService interface {
	Create(input *input.ResumeInput) error
	Update(resume *input.ResumeInput) error
	Delete(id uint) error
	GetByID(id uint) (*models.Resume, error)
	GetAllByUserID(id uint) ([]*models.Resume, error)
}

type dashboardService struct {
	repo repository.ResumeRepository
}

func NewDashboardService(r repository.ResumeRepository) DashboardService {
	return &dashboardService{repo: r}
}

func (s *dashboardService) Create(input *input.ResumeInput) error {

	resume := &models.Resume{
		Title:  input.Title,
		UserId: input.UserID,
	}

	return s.repo.Create(resume)
}

func (s *dashboardService) GetAllByUserID(userID uint) ([]*models.Resume, error) {
	return s.repo.GetAllByUserID(userID)
}

func (s *dashboardService) GetByID(userID uint) (*models.Resume, error) {
	return s.repo.GetById(userID)
}

func (s *dashboardService) Update(input *input.ResumeInput) error {

	resume := &models.Resume{
		Title:  input.Title,
		UserId: input.UserID,
	}

	return s.repo.Update(resume)
}

func (s *dashboardService) Delete(id uint) error {
	return s.repo.Delete(id)
}
