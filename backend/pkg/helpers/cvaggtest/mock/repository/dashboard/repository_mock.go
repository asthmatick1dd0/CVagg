package dashboard

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"
)

type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) Create(tx *gorm.DB, user *models.Resume) cvaggerr.Error {
	args := m.Called(tx, user)
	return cvaggerr.NewD(args.Error(0))
}

func (m *MockRepository) GetByID(id uint) (*models.Resume, cvaggerr.Error) {
	args := m.Called(id)

	if args.Get(0) == nil {
		return nil, cvaggerr.NewD(args.Error(1))
	}

	return args.Get(0).(*models.Resume), cvaggerr.NewD(args.Error(1))
}

func (m *MockRepository) Update(tx *gorm.DB, resume *models.Resume, id uint) cvaggerr.Error {
	args := m.Called(tx, resume, id)
	return cvaggerr.NewD(args.Error(0))
}

func (m *MockRepository) Delete(tx *gorm.DB, id uint) cvaggerr.Error {
	args := m.Called(tx, id)
	return cvaggerr.NewD(args.Error(0))
}

func (m *MockRepository) GetAllByUserID(userID uint) ([]*models.Resume, cvaggerr.Error) {
	args := m.Called(userID)

	if args.Get(0) == nil {
		return nil, cvaggerr.NewD(args.Error(1))
	}

	return args.Get(0).([]*models.Resume), cvaggerr.NewD(args.Error(1))
}
