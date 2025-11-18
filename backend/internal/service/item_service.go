package service

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
)

type ItemService interface {
	ResumeItemService[input.ResumeInput]
}

func NewItemService(r repository.ItemRepository) ItemService {
	return NewResumeItemService[input.ResumeInput](
		r,
		func(input.ResumeInput) models.ResumeItem {

		},
		func(models.ResumeItem) input.ResumeInput {

		},
	)
}
