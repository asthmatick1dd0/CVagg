package service

import (
	"github.com/asthmatick1dd0/CVagg/internal/repository"
)

type ResumeItemService[T any] interface {
	Create(entity *T) error
	Update(entity *T) error
	Delete(id uint) error
	GetAllByResumeID(id uint) ([]*T, error)
}

type resumeItemService[T any] struct {
	// generic репо
	r repository.ResumeItemRepository[T]
}

// Передаём как репо нужный нам репозиторий в виде (r repository.ИмяРепозитория) т.к. это равносильно
// r repository.ResumeItemRepository[ИмяРепозитория]
func NewResumeItemService[T any](r repository.ResumeItemRepository[T]) ResumeItemService[T] {
	return &resumeItemService[T]{r}
}

func (s *resumeItemService[T]) Create(entity *T) error {
	return s.r.Create(entity)
}

func (s *resumeItemService[T]) Update(entity *T) error {
	return s.r.Update(entity)
}

func (s *resumeItemService[T]) Delete(id uint) error {
	return s.r.Delete(id)
}

func (s *resumeItemService[T]) GetAllByResumeID(id uint) ([]*T, error) {
	return s.r.GetAllByResumeID(id)
}
