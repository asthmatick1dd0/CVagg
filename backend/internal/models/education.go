package models

import (
	"time"

	"gorm.io/gorm"
)

type Education struct {
	gorm.Model
	University string     `gorm:"type:varchar(100)" json:"university"`
	Faculty    string     `gorm:"type:varchar(100)" json:"faculty"`
	Degree     string     `gorm:"type:varchar(100)" json:"degree"`
	Major      string     `gorm:"type:varchar(100)" json:"major"`
	StartDate  time.Time  `gorm:"not null" json:"start_date"`
	EndDate    *time.Time `gorm:"not null" json:"end_date"`
	Finished   bool       `gorm:"not null" json:"finished"`
	Item
}
