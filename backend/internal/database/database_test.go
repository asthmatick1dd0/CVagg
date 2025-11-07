package database

import (
	"testing"

	"github.com/asthmatick1dd0/CVagg/internal/models"
)

// тест проверки связи бд и бэка
func TestConnectDB(t *testing.T) {
	db, err := ConnectDB()
	if err != nil {
		t.Fatalf("Failed to connect to DB: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		t.Fatalf("Failed to get sql.DB: %v", err)
	}
	defer sqlDB.Close()
}

// тест для модели user
func TestUserCRUD(t *testing.T) {
	db, err := ConnectDB()
	if err != nil {
		t.Fatalf("Cannot connect to DB: %v", err)
	}

	
	user := models.User{
		Email:        "test@example.com",
		Username:     "testuser",
		PasswordHash: "password123",
	}

	if err := db.Create(&user).Error; err != nil {
		t.Fatalf("Failed to create user: %v", err)
	}

	
	var readUser models.User
	if err := db.First(&readUser, "email = ?", "test@example.com").Error; err != nil {
		t.Fatalf("Failed to read user: %v", err)
	}

	
	if readUser.Username != "testuser" {
		t.Errorf("Expected username 'testuser', got '%s'", readUser.Username)
	}

	
	if err := db.Delete(&readUser).Error; err != nil {
		t.Fatalf("Failed to delete user: %v", err)
	}
}
