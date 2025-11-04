package repository

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"gorm.io/gorm"
)

type ResumeRepository interface {
	BaseRepository[models.Resume]
	GetByUserId(userId uint) ([]models.Resume, error)
}

type resumeRepo struct {
	db *gorm.DB
}

func NewResumeRepository(db *gorm.DB) ResumeRepository {
	return &resumeRepo{db}
}

func (r *resumeRepo) Create(user *models.Resume) error {
	return r.db.Create(user).Error
}

func (r *resumeRepo) GetById(id uint) (*models.Resume, error) {
	var resume models.Resume
	if err := r.db.First(&resume, id).Error; err != nil {
		return nil, err
	}
	return &resume, nil
}

func (r *resumeRepo) Update(resume *models.Resume) error {
	return r.db.Save(resume).Error
}

func (r *resumeRepo) Delete(id uint) error {
	return r.db.Where("id = ?", id).Delete(&models.Resume{}).Error
}

func (r *resumeRepo) GetByUserId(userId uint) ([]models.Resume, error) {
	var resumes []models.Resume
	if err := r.db.Where("user_id = ?", userId).Find(&resumes).Error; err != nil {
		return nil, err
	}
	return resumes, nil
}
