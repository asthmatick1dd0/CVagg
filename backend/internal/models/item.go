package models

type Item struct {
	ResumeId uint   `gorm:"not null;index" json:"resume_id"`
	Resume   Resume `json:"resume"`

	UserId uint `gorm:"not null;index" json:"user_id"`
	User   User `json:"user"`
}
