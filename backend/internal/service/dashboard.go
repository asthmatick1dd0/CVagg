package service

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	// "github.com/asthmatick1dd0/CVagg/internal/transport/input"
)

type DashboardService interface {
	GetAllByUserID(id uint) ([]*models.Resume, error)
	GetByID(id uint) (*models.Resume, error)
	Delete(id uint) error
}

type dashboardService struct {
	repo repository.ResumeRepository
}

func NewDashboardService(r repository.ResumeRepository) DashboardService {
	return &dashboardService{repo: r}
}

func (s *dashboardService) GetAllByUserID(userID uint) ([]*models.Resume, error) {
	return s.repo.GetAllByUserID(userID)
}

func (s *dashboardService) GetByID(userID uint) (*models.Resume, error) {
	return s.repo.GetById(userID)
}

func (s *dashboardService) Delete(id uint) error {
	return s.repo.Delete(id)
}
