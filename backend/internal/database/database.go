package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/asthmatick1dd0/CVagg/internal/models"
)

func ConnectDB() (*gorm.DB, error) {
	host := os.Getenv("POSTGRES_HOST")
	if host == "" {
		host = "database"
	}
	user := os.Getenv("POSTGRES_USER")
	if user == "" {
		user = "postgres"
	}
	pass := os.Getenv("POSTGRES_PASSWORD")
	if pass == "" {
		pass = "your_password"
	}
	dbname := os.Getenv("POSTGRES_DB")
	if dbname == "" {
		dbname = "your_database"
	}
	port := os.Getenv("POSTGRES_DB_PORT")
	if port == "" {
		port = "5432"
	}
	sslmode := os.Getenv("POSTGRES_SSLMODE")
	if sslmode == "" {
		sslmode = "disable"
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		host, user, pass, dbname, port, sslmode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to open db: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get sql.DB: %w", err)
	}

	// Пул соединений
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(25)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	// Простая проверка ping с retry
	for i := 0; i < 5; i++ {
		if err = sqlDB.Ping(); err == nil {
			// Connected — perform auto-migration then return
			if migrateErr := db.AutoMigrate(
				&models.User{},
				&models.Resume{},
				&models.ResumeItem{},
				&models.About{},
				&models.Education{},
				&models.HardSkill{},
				&models.HardSkillsCatalog{},
				&models.JobExperience{},
			); migrateErr != nil {
				return nil, fmt.Errorf("auto migrate failed: %w", migrateErr)
			}
			return db, nil
		}
		log.Printf("db ping failed (attempt %d): %v", i+1, err)
		time.Sleep(2 * time.Second)
	}

	return nil, fmt.Errorf("db ping failed after retries: %w", err)
}
