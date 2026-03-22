package dashboard_test

import (
	"errors"
	"io"
	"net/http/httptest"
	"testing"

	mockService "github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggtest/mock/service/dashboard"
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/asthmatick1dd0/CVagg/internal/modules/dashboard"
)

// В тесте используем конструктор для Handler
func setupHandler() (*fiber.App, *mockService.MockService) {
	app := fiber.New()
	mockSvc := new(mockService.MockService)

	h := dashboard.NewHandler(mockSvc) // Используем конструктор, который есть в проекте

	app.Get("/dashboard/:id", h.GetByID)

	return app, mockSvc
}

func TestGetByIDHandler_Success(t *testing.T) {
	app, mockSvc := setupHandler()

	r := &models.Resume{Title: "Test resume", UserID: 1}
	r.ID = 1

	mockSvc.On("GetByID", mock.Anything, uint(1)).Return(r, nil)

	req := httptest.NewRequest("GET", "/dashboard/1", nil)
	resp, err := app.Test(req)

	assert.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)

	mockSvc.AssertExpectations(t)
}

func TestGetByIDHandler_InvalidID(t *testing.T) {
	app, _ := setupHandler()

	req := httptest.NewRequest("GET", "/dashboard/abc", nil)
	resp, err := app.Test(req)

	assert.NoError(t, err)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestGetByIDHandler_NotFound(t *testing.T) {
	app, mockSvc := setupHandler()

	mockSvc.On("GetByID", mock.Anything, uint(1)).Return(nil, errors.New("not found"))

	req := httptest.NewRequest("GET", "/dashboard/1", nil)
	resp, err := app.Test(req)

	assert.NoError(t, err)
	assert.Equal(t, 404, resp.StatusCode)

	body, _ := io.ReadAll(resp.Body)
	assert.Contains(t, string(body), "not found")

	mockSvc.AssertExpectations(t)
}