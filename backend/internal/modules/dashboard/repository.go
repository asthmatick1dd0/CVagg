package dashboard

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"gorm.io/gorm"
)

type Repository interface {
	Create(tx *gorm.DB, user *models.Resume) error
	GetByID(id uint) (*models.Resume, error)
	Update(tx *gorm.DB, resume *models.Resume) error
	Delete(tx *gorm.DB, id uint) error
	GetAllByUserID(userID uint) ([]*models.Resume, error)
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

func (r *resumeRepo) Create(tx *gorm.DB, user *models.Resume) error {
	db := r.getDB(tx)
	if err := db.Table("resumes.profile").Create(user).Error; err != nil {
		return cvaggerr.ErrorDataBase()
	}
	return nil
}

func (r *resumeRepo) GetByID(id uint) (*models.Resume, error) {
	var resume models.Resume
	if err := r.db.Table("resumes.profile").First(&resume, id).Error; err != nil {
		return nil, cvaggerr.ErrorDataBase()
	}
	return &resume, nil
}

func (r *resumeRepo) Update(tx *gorm.DB, resume *models.Resume) error {
	db := r.getDB(tx)
	if err := db.Table("resumes.profile").Save(resume).Error; err != nil {
		return cvaggerr.ErrorDataBase()
	}
	return nil
}

func (r *resumeRepo) Delete(tx *gorm.DB, id uint) error {
	var entity models.Resume
	db := r.getDB(tx)
	if err := db.Table("resumes.profile").Delete(&entity, id).Error; err != nil {
		return cvaggerr.ErrorDataBase()
	}
	return nil
}

func (r *resumeRepo) GetAllByUserID(userId uint) ([]*models.Resume, error) {
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
