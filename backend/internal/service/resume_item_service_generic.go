package service

import (
	"github.com/asthmatick1dd0/CVagg/internal/repository"
)

type ResumeItemService[D any] interface {
	Create(entity *D) error
	Update(entity *D) error
	Delete(id uint) error
	GetAllByResumeID(id uint) ([]*D, error)
}

// D - data transfer object ; M - model
type resumeItemService[D any, M any] struct {
	// generic репо
	r repository.ResumeItemRepository[M]
	// конвертируем generic тип из типа D в М. Допустим из input.ResumeInput в models.ResumeItem
	converter func(D) M
	// Обратная ситуация, из M в D
	backconverter func(M) D
}

// Передаём как репо нужный нам репозиторий в виде (r repository.ИмяРепозитория) т.к. это равносильно
// r repository.ResumeItemRepository[ИмяРепозитория]
func NewResumeItemService[D any, M any](r repository.ResumeItemRepository[M], conv func(D) M, backconv func(M) D) ResumeItemService[D] {
	return &resumeItemService[D, M]{r, conv, backconv}
}

func (s *resumeItemService[D, M]) Create(entity *D) error {
	model := s.converter(*entity)
	return s.r.Create(&model)
}

func (s *resumeItemService[D, M]) Update(entity *D) error {
	model := s.converter(*entity)
	return s.r.Update(&model)
}

func (s *resumeItemService[D, M]) Delete(id uint) error {
	return s.r.Delete(id)
}

func (s *resumeItemService[D, M]) GetAllByResumeID(id uint) ([]*D, error) {
	models, err := s.r.GetAllByResumeID(id)
	if err != nil {
		return nil, err
	}

	var result []*D
	for _, m := range models {
		t := s.backconverter(*m)
		result = append(result, &t)
	}
	return result, nil
}
