package dashboard_test

import (
	"net/http/httptest"
	"testing"

	mockService "github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggtest/mock/service/dashboard"
	dashboardHandler "github.com/asthmatick1dd0/CVagg/internal/modules/dashboard"
	mockService "github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggtest/mock/service/dashboard"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func TestGetByIDHandler(t *testing.T) {
	app := fiber.New()

	mockSvc := new(mockService.MockService)

	h := dashboardHandler.NewHandler(mockSvc)

	app.Get("/dashboard/:id", h.GetByID)

	mockSvc.
		On("GetByID", uint(1)).
		Return(nil, nil)

	req := httptest.NewRequest("GET", "/dashboard/1", nil)

	resp, err := app.Test(req)

	assert.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)

	mockSvc.AssertExpectations(t)
}

func setupHandler() (*fiber.App, *mockService.MockService) {
  app := fiber.New()

	mockSvc := new(mockService.MockService)

	h := dashboardHandler.NewHandler(mockSvc)

	app.Get("/dashboard/:id", h.GetByID)

	return app, mockSvc
}

func TestGetByIDHandler_Success(t *testing.T) {
	app, mockSvc := setupHandler()
	mockSvc.
		On("GetByID", uint(1)).
		Return(nil, nil)

	req := httptest.NewRequest("GET", "/dashboard/1", nil)

	resp, err := app.Test(req)

	assert.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)

	mockSvc.AssertExpectations(t)
}

func TestGetByIDHandler_ServiceError(t *testing.T) {
	app, mockSvc := setupHandler()

	app, mockSvc := setupHandler()

	mockSvc.
		On("GetByID", uint(1)).
		Return(nil, fiber.ErrInternalServerError)

	req := httptest.NewRequest("GET", "/dashboard/1", nil)

	resp, err := app.Test(req)

	assert.NoError(t, err)
	assert.Equal(t, 404, resp.StatusCode)

	mockSvc.AssertExpectations(t)
}
