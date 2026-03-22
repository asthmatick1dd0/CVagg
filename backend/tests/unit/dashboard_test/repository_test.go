package dashboard_test

import (
	"errors"
	"testing"

	mockRepo "github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggtest/mock/repository/dashboard"
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/stretchr/testify/assert"
)

func TestMockRepository_AllMethods(t *testing.T) {

	type testCase struct {
		name        string
		method      string
		input       interface{}
		mockReturn  interface{}
		mockError   error
		expectedErr bool
	}

	r1 := &models.Resume{Title: "Test", UserID: 1}
	r1.ID = 1

	r2 := &models.Resume{Title: "Another", UserID: 2}
	r2.ID = 2

	tests := []testCase{
		{
			name:        "GetByID success",
			method:      "GetByID",
			input:       uint(1),
			mockReturn:  r1,
			mockError:   nil,
			expectedErr: false,
		},
		{
			name:        "GetByID error",
			method:      "GetByID",
			input:       uint(2),
			mockReturn:  nil,
			mockError:   errors.New("not found"),
			expectedErr: true,
		},
		{
			name:        "Create success",
			method:      "Create",
			input:       r1,
			mockReturn:  nil,
			mockError:   nil,
			expectedErr: false,
		},
		{
			name:        "Create error",
			method:      "Create",
			input:       r2,
			mockReturn:  nil,
			mockError:   errors.New("cannot create"),
			expectedErr: true,
		},
		{
			name:        "Update success",
			method:      "Update",
			input:       r1,
			mockReturn:  nil,
			mockError:   nil,
			expectedErr: false,
		},
		{
			name:        "Update error",
			method:      "Update",
			input:       r2,
			mockReturn:  nil,
			mockError:   errors.New("cannot update"),
			expectedErr: true,
		},
		{
			name:        "Delete success",
			method:      "Delete",
			input:       uint(1),
			mockReturn:  nil,
			mockError:   nil,
			expectedErr: false,
		},
		{
			name:        "Delete error",
			method:      "Delete",
			input:       uint(2),
			mockReturn:  nil,
			mockError:   errors.New("cannot delete"),
			expectedErr: true,
		},
		{
			name:        "GetAllByUserID success",
			method:      "GetAllByUserID",
			input:       uint(1),
			mockReturn:  []*models.Resume{r1},
			mockError:   nil,
			expectedErr: false,
		},
		{
			name:        "GetAllByUserID error",
			method:      "GetAllByUserID",
			input:       uint(2),
			mockReturn:  nil,
			mockError:   errors.New("no resumes"),
			expectedErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := new(mockRepo.MockRepository)
			defer repo.AssertExpectations(t)

			switch tt.method {
			case "GetByID":
				repo.On("GetByID", tt.input.(uint)).Return(tt.mockReturn, tt.mockError)
				res, err := repo.GetByID(tt.input.(uint))
				if tt.expectedErr {
					assert.Error(t, err)
					assert.Nil(t, res)
				} else {
					assert.NoError(t, err)
					assert.Equal(t, tt.mockReturn, res)
				}

			case "Create":
				repo.On("Create", nil, tt.input.(*models.Resume)).Return(tt.mockError)
				err := repo.Create(nil, tt.input.(*models.Resume))
				if tt.expectedErr {
					assert.Error(t, err)
				} else {
					assert.NoError(t, err)
				}

			case "Update":
				repo.On("Update", nil, tt.input.(*models.Resume)).Return(tt.mockError)
				err := repo.Update(nil, tt.input.(*models.Resume))
				if tt.expectedErr {
					assert.Error(t, err)
				} else {
					assert.NoError(t, err)
				}

			case "Delete":
				repo.On("Delete", nil, tt.input.(uint)).Return(tt.mockError)
				err := repo.Delete(nil, tt.input.(uint))
				if tt.expectedErr {
					assert.Error(t, err)
				} else {
					assert.NoError(t, err)
				}

			case "GetAllByUserID":
				repo.On("GetAllByUserID", tt.input.(uint)).Return(tt.mockReturn, tt.mockError)
				res, err := repo.GetAllByUserID(tt.input.(uint))
				if tt.expectedErr {
					assert.Error(t, err)
					assert.Nil(t, res)
				} else {
					assert.NoError(t, err)
					assert.Equal(t, tt.mockReturn, res)
				}
			}
		})
	}
}