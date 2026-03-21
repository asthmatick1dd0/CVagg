package dashboard

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"gorm.io/gorm"
)

type Service interface {
	GetAllByUserID(id uint) ([]*models.Resume, error)
	GetByID(id uint) (*models.Resume, error)
	Delete(tx *gorm.DB, id uint) error
}

type dashboardService struct {
	repo Repository
}

func NewDashboardService(r Repository) Service {
	return &dashboardService{repo: r}
}

func (s *dashboardService) GetAllByUserID(userID uint) ([]*models.Resume, error) {
	return s.repo.GetAllByUserID(userID)
}

func (s *dashboardService) GetByID(userID uint) (*models.Resume, error) {
	return s.repo.GetByID(userID)
}

func (s *dashboardService) Delete(tx *gorm.DB, id uint) error {
	return s.repo.Delete(tx, id)
}
