package models

import (
	"gorm.io/gorm"
)

type Resumes struct {
	gorm.Model
	AuthorId uint   `json:"author_id"`
	Title    string `json:"title"`
}
