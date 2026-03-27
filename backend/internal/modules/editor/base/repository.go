package base

import (
	"fmt"

	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"gorm.io/gorm"
)

type ResumeItemRepository[T any] interface {
	Create(tx *gorm.DB, entity *T, table string) cvaggerr.Error
	Delete(tx *gorm.DB, id uint, table string) cvaggerr.Error
	Update(tx *gorm.DB, entity *T, table string, entityId uint) cvaggerr.Error
	GetByID(tx *gorm.DB, id uint, table string) (*T, cvaggerr.Error)
	GetAllByResumeID(tx *gorm.DB, resumeID uint, table string) ([]*T, cvaggerr.Error)
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

func (r *resumeItemRepo[T]) Create(tx *gorm.DB, entity *T, table string) cvaggerr.Error {
	db := r.getDB(tx)
	if err := db.Table(table).Create(entity).Error; err != nil {
		fmt.Printf("[REPO ERROR] Create failed in table %s: %v\n", table, err)
		r.logger.Error(fmt.Sprintf("Error in database: %v", err))
		return cvaggerr.ErrorDataBase()
	}
	return nil
}

func (r *resumeItemRepo[T]) Delete(tx *gorm.DB, id uint, table string) cvaggerr.Error {
	var entity T
	db := r.getDB(tx)
	if err := db.Table(table).Delete(&entity, id).Error; err != nil {
		r.logger.Error(fmt.Sprintf("Error in database: %v", err))
		return cvaggerr.ErrorDataBase()
	}
	return nil
}

func (r *resumeItemRepo[T]) Update(tx *gorm.DB, entity *T, table string, entityId uint) cvaggerr.Error {
	db := r.getDB(tx)

	if err := db.Table(table).Where("id = ?", entityId).Updates(entity).Error; err != nil {
		fmt.Printf("[REPO ERROR] Update failed in table %s for id %d: %v\n", table, entityId, err)
		r.logger.Error(fmt.Sprintf("Error in database: %v", err))
		return cvaggerr.ErrorDataBase()
	}
	return nil
}

func (r *resumeItemRepo[T]) GetByID(tx *gorm.DB, id uint, table string) (*T, cvaggerr.Error) {
	var entity T
	db := r.getDB(tx)
	if err := db.Table(table).First(&entity, id).Error; err != nil {
		r.logger.Error(fmt.Sprintf("Error in database: %v", err))
		return nil, cvaggerr.ErrorDataBase()
	}
	return &entity, nil
}

func (r *resumeItemRepo[T]) GetAllByResumeID(tx *gorm.DB, resumeId uint, table string) ([]*T, cvaggerr.Error) {
	var entities []*T
	db := r.getDB(tx)
	if err := db.Table(table).Where("resume_id = ?", resumeId).Find(&entities).Error; err != nil {
		r.logger.Error(fmt.Sprintf("Error in database: %v", err))
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
