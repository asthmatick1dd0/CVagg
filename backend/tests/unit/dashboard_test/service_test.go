package dashboard_test

import (
	"testing"

	mockRepo "github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggtest/mock/repository/dashboard"
	dashboardService "github.com/asthmatick1dd0/CVagg/internal/modules/dashboard"
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/stretchr/testify/assert"
)

func TestService_GetByID(t *testing.T) {
	repo := new(mockRepo.MockRepository)
	service := dashboardService.NewDashboardService(repo)

	r := &models.Resume{Title: "Test", UserID: 1}

	repo.On("GetByID", uint(1)).Return(r, nil)

	result, err := service.GetByID(1)

	assert.NoError(t, err)
	assert.Equal(t, r, result)

	repo.AssertExpectations(t)
}

func TestService_GetAllByUserID(t *testing.T) {
	repo := new(mockRepo.MockRepository)
	service := dashboardService.NewDashboardService(repo)

	r := &models.Resume{Title: "Test", UserID: 1}

	repo.On("GetAllByUserID", uint(1)).Return([]*models.Resume{r}, nil)

	result, err := service.GetAllByUserID(1)

	assert.NoError(t, err)
	assert.Len(t, result, 1)
	assert.Equal(t, r, result[0])

	repo.AssertExpectations(t)
}

func TestService_Delete(t *testing.T) {
	repo := new(mockRepo.MockRepository)
	service := dashboardService.NewDashboardService(repo)

	// передаем nil вместо *gorm.DB
	repo.On("Delete", nil, uint(1)).Return(nil)

	err := service.Delete(nil, 1)

	assert.NoError(t, err)
	repo.AssertExpectations(t)
}