package dashboard_test

import (
	"testing"

	"github.com/asthmatick1dd0/CVagg/internal/models"
	mockRepo "github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggtest/mock/repository/dashboardlpers/cvaggtest/mock/repository/dashboard"

	"github.com/stretchr/testify/assert"
)

func TestMockRepository_GetByID(t *testing.T) {
	repo := new(mockRepo.MockRepository)

	resume := &models.Resume{
		ID: 1,
	}

	repo.
		On("GetByID", uint(1)).
		Return(resume, nil)

	result, err := repo.GetByID(1)

	assert.NoError(t, err)
	assert.Equal(t, resume, result)

	repo.AssertExpectations(t)
}

func TestMockRepository_Delete(t *testing.T) {
	repo := new(mockRepo.MockRepository)

	repo.
		On("Delete", uint(1)).
		Return(nil)

	err := repo.Delete(1)

	assert.NoError(t, err)

	repo.AssertExpectations(t)
}

