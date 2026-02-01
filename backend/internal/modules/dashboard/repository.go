package dashboard

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"gorm.io/gorm"
)

type Repository interface {
	Create(user *models.Resume) error
	GetByID(id uint) (*models.Resume, error)
	Update(resume *models.Resume) error
	Delete(id uint) error
	GetAllByUserID(userID uint) ([]*models.Resume, error)
}

type resumeRepo struct {
	db     *gorm.DB
	logger *cvagglog.Logger
}

func NewResumeRepository(db *gorm.DB, logger *cvagglog.Logger) Repository {
	return &resumeRepo{
		db:     db,
		logger: logger,
	}
}

func (r *resumeRepo) Create(user *models.Resume) error {
	return r.db.Create(user).Error
}

func (r *resumeRepo) GetByID(id uint) (*models.Resume, error) {
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

func (r *resumeRepo) GetAllByUserID(userId uint) ([]*models.Resume, error) {
	var resumes []*models.Resume
	if err := r.db.Where("user_id = ?", userId).Find(&resumes).Error; err != nil {
		return nil, err
	}
	return resumes, nil
}
