package dashboard

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"gorm.io/gorm"
)

type Repository interface {
	Create(tx *gorm.DB, user *models.Resume) cvaggerr.Error
	GetByID(id uint) (*models.Resume, cvaggerr.Error)
	Update(tx *gorm.DB, resume *models.Resume, resumeId uint) cvaggerr.Error
	Delete(tx *gorm.DB, id uint) cvaggerr.Error
	GetAllByUserID(userID uint) ([]*models.Resume, cvaggerr.Error)
}

type resumeRepo struct {
	db     *gorm.DB
	logger *cvagglog.Logger
}

func NewRepository(db *gorm.DB, logger *cvagglog.Logger) Repository {
	return &resumeRepo{
		db:     db,
		logger: logger,
	}
}

func (r *resumeRepo) Create(tx *gorm.DB, user *models.Resume) cvaggerr.Error {
	db := r.getDB(tx)
	if err := db.Table("resumes.profile").Create(user).Error; err != nil {
		return cvaggerr.ErrorDataBase()
	}
	return nil
}

func (r *resumeRepo) GetByID(id uint) (*models.Resume, cvaggerr.Error) {
	var resume models.Resume
	if err := r.db.Table("resumes.profile").First(&resume, id).Error; err != nil {
		return nil, cvaggerr.ErrorDataBase()
	}
	return &resume, nil
}

func (r *resumeRepo) Update(tx *gorm.DB, resume *models.Resume, resumeId uint) cvaggerr.Error {
	db := r.getDB(tx)
	if err := db.Table("resumes.profile").Where("id = ?", resumeId).Updates(resume).Error; err != nil {
		return cvaggerr.ErrorDataBase()
	}
	return nil
}

func (r *resumeRepo) Delete(tx *gorm.DB, id uint) cvaggerr.Error {
	var entity models.Resume
	db := r.getDB(tx)
	if err := db.Table("resumes.profile").Delete(&entity, id).Error; err != nil {
		return cvaggerr.ErrorDataBase()
	}
	return nil
}

func (r *resumeRepo) GetAllByUserID(userId uint) ([]*models.Resume, cvaggerr.Error) {
	var resumes []*models.Resume
	if err := r.db.Table("resumes.profile").Where("user_id = ?", userId).Find(&resumes).Error; err != nil {
		return nil, cvaggerr.ErrorDataBase()
	}
	return resumes, nil
}

func (r *resumeRepo) getDB(tx *gorm.DB) *gorm.DB {
	if tx != nil {
		return tx
	}
	return r.db
}
