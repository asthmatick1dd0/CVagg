package dashboard

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"
)

type MockRepository struct {
	mock.Mock
}

// Методы полностью соответствуют интерфейсу Repository

func (m *MockRepository) Create(tx *gorm.DB, resume *models.Resume) error {
	args := m.Called(tx, resume)
	return args.Error(0)
}

func (m *MockRepository) GetByID(id uint) (*models.Resume, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Resume), args.Error(1)
}

func (m *MockRepository) Update(tx *gorm.DB, resume *models.Resume) error {
	args := m.Called(tx, resume)
	return args.Error(0)
}

func (m *MockRepository) Delete(tx *gorm.DB, id uint) error {
	args := m.Called(tx, id)
	return args.Error(0)
}

func (m *MockRepository) GetAllByUserID(userID uint) ([]*models.Resume, error) {
	args := m.Called(userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*models.Resume), args.Error(1)
}