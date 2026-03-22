package dashboard

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/stretchr/testify/mock"
)

type MockService struct {
	mock.Mock
}

func (m *MockService) GetAllByUserID(id uint) ([]*models.Resume, error) {
	args := m.Called(id)

	if args.Get(0) == nil {
		return nil, args.Error(1)
	}

	return args.Get(0).([]*models.Resume), args.Error(1)
}

func (m *MockService) GetByID(id uint) (*models.Resume, error) {
	args := m.Called(id)

	if args.Get(0) == nil {
		return nil, args.Error(1)
	}

	return args.Get(0).(*models.Resume), args.Error(1)
}

func (m *MockService) Delete(id uint) error {
	args := m.Called(id)
	return args.Error(0)
}