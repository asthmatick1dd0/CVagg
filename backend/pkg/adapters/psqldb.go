// Package adapters contains adapters for diffetent services
package adapters

import (
	"database/sql"
	"fmt"

	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"github.com/pressly/goose"
	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type pqData struct {
	Host     string
	Port     int
	User     string
	Password string
	Name     string
	SSLMode  string
}

func importData(conf *viper.Viper) *pqData {
	return &pqData{
		Host:     conf.GetString("pq.host"),
		Port:     conf.GetInt("pq.port"),
		User:     conf.GetString("pq.user"),
		Password: conf.GetString("pq.pass"),
		Name:     conf.GetString("pq.name"),
	}
}

func New(conf *viper.Viper, cvagglogger *cvagglog.Logger) *gorm.DB {
	connection := importData(conf)
	connectionString := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		connection.Host, connection.Port, connection.User, connection.Password, connection.Name)

	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		cvagglogger.Fatal(err.Error())
	}
	checkPing(cvagglogger, db)
	cvagglogger.Info("database connected")
	migrationsUp(db, cvagglogger)
	gormDB, err := gorm.Open(postgres.New(postgres.Config{
		Conn: db,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		cvagglogger.Fatal(err.Error())
	}
	cvagglogger.Info("gorm database connected")
	return gormDB
}

func checkPing(logger *cvagglog.Logger, db *sql.DB) {
	err := db.Ping()
	if err != nil {
		logger.Fatal(err.Error())
	}
}

func migrationsUp(db *sql.DB, logger *cvagglog.Logger) {
	goose.SetTableName("public.goose_db_version")
	if err := goose.Up(db, "db/migrate"); err != nil {
		logger.Fatal("Error in migrations: " + err.Error())
	}

	logger.Info("Migrations completed")
}
