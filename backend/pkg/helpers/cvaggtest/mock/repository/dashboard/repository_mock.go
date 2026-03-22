package dashboard

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/stretchr/testify/mock"
)

type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) Create(user *models.Resume) error {
	args := m.Called(user)
	return args.Error(0)
}

func (m *MockRepository) GetByID(id uint) (*models.Resume, error) {
	args := m.Called(id)

	if args.Get(0) == nil {
		return nil, args.Error(1)
	}

	return args.Get(0).(*models.Resume), args.Error(1)
}

func (m *MockRepository) Update(resume *models.Resume) error {
	args := m.Called(resume)
	return args.Error(0)
}

func (m *MockRepository) Delete(id uint) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MockRepository) GetAllByUserID(userID uint) ([]*models.Resume, error) {
	args := m.Called(userID)

	if args.Get(0) == nil {
		return nil, args.Error(1)
	}

	return args.Get(0).([]*models.Resume), args.Error(1)
}