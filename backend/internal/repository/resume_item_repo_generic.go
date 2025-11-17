package repository

import (
	"gorm.io/gorm"
)

type ResumeItemRepository[T any] interface {
	BaseRepository[T]
	GetAllByResumeID(resumeId uint) ([]T, error)
}

// generic структура
type resumeItemRepo[T any] struct {
	db *gorm.DB
}

// в других репозиториях мы будем вызывать этот конструктор и на место generic структуры будет становиться нужная нам стуктура.
// например education
func NewResumeItemRepository[T any](db *gorm.DB) ResumeItemRepository[T] {
	return &resumeItemRepo[T]{db}
}

func (r *resumeItemRepo[T]) Create(entity *T) error {
	return r.db.Create(entity).Error
}

func (r *resumeItemRepo[T]) Delete(id uint) error {
	var entity T
	// здесь &entity нужно только для определения типа удаляемого объекта
	return r.db.Delete(&entity, id).Error
}

func (r *resumeItemRepo[T]) Update(entity *T) error {
	return r.db.Save(entity).Error
}

func (r *resumeItemRepo[T]) GetById(id uint) (*T, error) {
	// С помощью First GORM записывает значение в то entity которое мы ему передаём
	var entity T
	if err := r.db.First(&entity, id).Error; err != nil {
		return nil, err
	}
	return &entity, nil
}

func (r *resumeItemRepo[T]) GetAllByResumeID(resumeId uint) ([]T, error) {
	// Точно также как написал выше
	var entities []T
	if err := r.db.Where("resume_id = ?", resumeId).Find(&entities).Error; err != nil {
		return nil, err
	}
	return entities, nil
}
