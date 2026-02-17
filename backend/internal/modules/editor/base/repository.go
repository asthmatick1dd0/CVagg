package base

import (
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"gorm.io/gorm"
)

type ResumeItemRepository[T any] interface {
	Create(tx *gorm.DB, entity *T) cvaggerr.Error
	Delete(tx *gorm.DB, id uint) cvaggerr.Error
	Update(tx *gorm.DB, entity *T) cvaggerr.Error
	GetByID(tx *gorm.DB, id uint) (*T, cvaggerr.Error)
	GetAllByResumeID(tx *gorm.DB, resumeID uint) ([]*T, cvaggerr.Error)
}

type resumeItemRepo[T any] struct {
	db     *gorm.DB
	logger *cvagglog.Logger
}

func NewResumeItemRepository[T any](db *gorm.DB, logger *cvagglog.Logger) ResumeItemRepository[T] {
	return &resumeItemRepo[T]{
		db:     db,
		logger: logger,
	}
}

func (r *resumeItemRepo[T]) Create(tx *gorm.DB, entity *T) cvaggerr.Error {
	db := r.getDB(tx)
	if err := db.Create(entity).Error; err != nil {
		return cvaggerr.ErrorDataBase()
	}
	return nil
}

func (r *resumeItemRepo[T]) Delete(tx *gorm.DB, id uint) cvaggerr.Error {
	var entity T
	db := r.getDB(tx)
	if err := db.Delete(&entity, id).Error; err != nil {
		return cvaggerr.ErrorDataBase()
	}
	return nil
}

func (r *resumeItemRepo[T]) Update(tx *gorm.DB, entity *T) cvaggerr.Error {
	db := r.getDB(tx)
	if err := db.Save(entity).Error; err != nil {
		return cvaggerr.ErrorDataBase()
	}
	return nil
}

func (r *resumeItemRepo[T]) GetByID(tx *gorm.DB, id uint) (*T, cvaggerr.Error) {
	var entity T
	db := r.getDB(tx)
	if err := db.First(&entity, id).Error; err != nil {
		return nil, cvaggerr.ErrorDataBase()
	}
	return &entity, nil
}

func (r *resumeItemRepo[T]) GetAllByResumeID(tx *gorm.DB, resumeId uint) ([]*T, cvaggerr.Error) {
	var entities []*T
	db := r.getDB(tx)
	if err := db.Where("resume_id = ?", resumeId).Find(&entities).Error; err != nil {
		return nil, cvaggerr.ErrorDataBase()
	}
	return entities, nil
}

func (r *resumeItemRepo[T]) getDB(tx *gorm.DB) *gorm.DB {
	if tx != nil {
		return tx
	}
	return r.db
}
