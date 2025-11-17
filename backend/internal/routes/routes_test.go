package routes

import (
	"net/http/httptest"
	"testing"

	"github.com/asthmatick1dd0/CVagg/internal/database"
	"github.com/gofiber/fiber/v2"
)

func setupTestApp(t *testing.T) *fiber.App {
	db, err := database.ConnectDB()
	if err != nil {
		t.Fatalf("Cannot connect to DB: %v", err)
	}
	if db == nil {
		t.Fatal("DB should not be nil")
	}

	app := fiber.New()
	SetupRoutes(app)

	return app
}

// Тест Profile роута
func TestProfileMe(t *testing.T) {
	app := setupTestApp(t)
	req := httptest.NewRequest("GET", "/api/v1/profile/me", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}
	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}

func TestProfileResumes(t *testing.T) {
	app := setupTestApp(t)
	req := httptest.NewRequest("GET", "/api/v1/profile/resumes", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}
	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}

func TestProfileResumeExportByID(t *testing.T) {
	app := setupTestApp(t)
	req := httptest.NewRequest("GET", "/api/v1/profile/resumes/1/export", nil) // id написал рандомное
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}
	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}

func TestProfileResumeDeleteByID(t *testing.T) {
	app := setupTestApp(t)
	req := httptest.NewRequest("DELETE", "/api/v1/profile/resumes/1/delete", nil) // id написал рандомное
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}
	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}

func TestProfileChangeAvatar(t *testing.T) {
	app := setupTestApp(t)
	req := httptest.NewRequest("PATCH", "/api/v1/profile/settings/change-avatar", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}
	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}

func TestProfileChangeUsername(t *testing.T) {
	app := setupTestApp(t)
	req := httptest.NewRequest("PATCH", "/api/v1/profile/settings/change-username", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}
	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}

func TestProfileChangeEmail(t *testing.T) {
	app := setupTestApp(t)
	req := httptest.NewRequest("PATCH", "/api/v1/profile/settings/change-email", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}
	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}

func TestProfileChangePassword(t *testing.T) {
	app := setupTestApp(t)
	req := httptest.NewRequest("PATCH", "/api/v1/profile/settings/change-password", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}
	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}

func TestProfileSaveChanges(t *testing.T) {
	app := setupTestApp(t)
	req := httptest.NewRequest("POST", "/api/v1/profile/settings/save-changes", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}
	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}

// Тест Auth роута
func TestAuthRoute(t *testing.T) {
	app := setupTestApp(t)

	req := httptest.NewRequest("GET", "/api/v1/auth/signin", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}

	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}

// Тест Editor рутов
func TestEditorSave(t *testing.T) {
	app := setupTestApp(t)
	req := httptest.NewRequest("POST", "/api/v1/editor/save", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}
	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}

func TestEditorSaveByID(t *testing.T) {
	app := setupTestApp(t)
	req := httptest.NewRequest("PATCH", "/api/v1/editor/123/save", nil) // id написал рандомное
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}
	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}

func TestEditorHardSkillsCatalog(t *testing.T) {
	app := setupTestApp(t)
	req := httptest.NewRequest("GET", "/api/v1/editor/hard-skills-catalog", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}
	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}

func TestEditorTemplatesCatalog(t *testing.T) {
	app := setupTestApp(t)
	req := httptest.NewRequest("GET", "/api/v1/editor/templates-catalog", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}
	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}

func TestEditorExport(t *testing.T) {
	app := setupTestApp(t)
	req := httptest.NewRequest("GET", "/api/v1/editor/export", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}
	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}

func TestEditorExportByID(t *testing.T) {
	app := setupTestApp(t)
	req := httptest.NewRequest("GET", "/api/v1/editor/123/export", nil) // id написал рандомное
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}
	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}