package models

type Item struct {
	ResumeId uint `gorm:"not null;index" json:"resume_id"`

	UserId uint `gorm:"not null;index" json:"user_id"`
}
