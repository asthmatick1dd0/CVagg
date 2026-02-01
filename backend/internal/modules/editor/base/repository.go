package base

import (
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"gorm.io/gorm"
)

type ResumeItemRepository[T any] interface {
	Create(entity *T) error
	Delete(id uint) error
	Update(entity *T) error
	GetByID(id uint) (*T, error)
	GetAllByResumeID(resumeID uint) ([]*T, error)
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

func (r *resumeItemRepo[T]) Create(entity *T) error {
	return r.db.Create(entity).Error
}

func (r *resumeItemRepo[T]) Delete(id uint) error {
	var entity T
	return r.db.Delete(&entity, id).Error
}

func (r *resumeItemRepo[T]) Update(entity *T) error {
	return r.db.Save(entity).Error
}

func (r *resumeItemRepo[T]) GetByID(id uint) (*T, error) {
	var entity T
	if err := r.db.First(&entity, id).Error; err != nil {
		return nil, err
	}
	return &entity, nil
}

func (r *resumeItemRepo[T]) GetAllByResumeID(resumeId uint) ([]*T, error) {
	var entities []*T
	if err := r.db.Where("resume_id = ?", resumeId).Find(&entities).Error; err != nil {
		return nil, err
	}
	return entities, nil
}
