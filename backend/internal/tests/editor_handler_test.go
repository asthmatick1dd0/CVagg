package tests

import (
	"encoding/json"
	"errors"
	"testing"

	"github.com/asthmatick1dd0/CVagg/internal/handlers"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/gofiber/fiber/v2"
	"github.com/valyala/fasthttp"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// ===== MOCK SERVICE =====
type MockEditorService struct {
	mock.Mock
}

func (m *MockEditorService) SaveResume(resume *input.ResumeInput) error {
	args := m.Called(resume)
	return args.Error(0)
}

// ===== TEST =====
func TestEditorHandler_CreateResume(t *testing.T) {
	app := fiber.New()
	mockService := new(MockEditorService)
	handler := handlers.NewEditorHandler(mockService)

	validResume := input.ResumeInput{
		Title:  "Test Resume",
		UserID: 1,
	}
	body, _ := json.Marshal(validResume)

	// --- 1. Успешное создание (200) ---
	mockService.On("SaveResume", mock.Anything).Return(nil)

	ctx := app.AcquireCtx(&fasthttp.RequestCtx{})
	ctx.Request().SetBody(body)
	ctx.Request().Header.SetMethod("POST")
	ctx.Request().Header.SetContentType("application/json")

	err := handler.CreateResume(ctx)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, ctx.Response().StatusCode())

	// --- 2. Некорректный JSON (400) ---
	ctxBad := app.AcquireCtx(&fasthttp.RequestCtx{})
	ctxBad.Request().SetBody([]byte(`invalid json`))
	ctxBad.Request().Header.SetMethod("POST")
	ctxBad.Request().Header.SetContentType("application/json")

	err = handler.CreateResume(ctxBad)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusBadRequest, ctxBad.Response().StatusCode())

	// --- 3. Ошибка сервиса (500) ---
	mockService.On("SaveResume", mock.Anything).Return(errors.New("service error"))

	ctxErr := app.AcquireCtx(&fasthttp.RequestCtx{})
	ctxErr.Request().SetBody(body)
	ctxErr.Request().Header.SetMethod("POST")
	ctxErr.Request().Header.SetContentType("application/json")

	err = handler.CreateResume(ctxErr)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusInternalServerError, ctxErr.Response().StatusCode())
}