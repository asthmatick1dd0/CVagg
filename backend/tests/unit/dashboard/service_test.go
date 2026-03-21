package dashboard_test

import (
	"testing"
	"errors"

	mockRepo "github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggtest/mock/repository/dashboard"
	dashboardService "github.com/asthmatick1dd0/CVagg/internal/modules/dashboard"
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/stretchr/testify/assert"
)

func TestGetByID(t *testing.T) {

	mockRepository := new(mockRepo.MockRepository)

	service := dashboardService.NewDashboardService(mockRepository)

	resume := &models.Resume{
		ID: 1,
	}

	mockRepository.
		On("GetByID", uint(1)).
		Return(resume, nil)

	result, err := service.GetByID(1)

	assert.NoError(t, err)
	assert.Equal(t, resume, result)

	mockRepository.AssertExpectations(t)
}

func TestService_GetByID_Success(t *testing.T) {

 mockRepository := new(mockRepo.MockRepository)

 service := dashboardService.NewDashboardService(mockRepository)

 resume := &models.Resume{
  ID: 1,
 }

 mockRepository.
  On("GetByID", uint(1)).
  Return(resume, nil)

 result, err := service.GetByID(1)

 assert.NoError(t, err)
 assert.Equal(t, resume, result)

 mockRepository.AssertExpectations(t)
}

func TestService_GetByID_NotFound(t *testing.T) {

 mockRepository := new(mockRepo.MockRepository)

 service := dashboardService.NewDashboardService(mockRepository)

 mockRepository.
  On("GetByID", uint(1)).
  Return(nil, errors.New("not found"))

 result, err := service.GetByID(1)

 assert.Error(t, err)
 assert.Nil(t, result)

 mockRepository.AssertExpectations(t)
}

func TestService_Delete(t *testing.T) {

 mockRepository := new(mockRepo.MockRepository)

 service := dashboardService.NewDashboardService(mockRepository)

 mockRepository.
  On("Delete", uint(1)).
  Return(nil)

 err := service.Delete(1)

 assert.NoError(t, err)

 mockRepository.AssertExpectations(t)
}