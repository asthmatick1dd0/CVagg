package service

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
)

type ItemService interface {
	ResumeItemService[models.ResumeItem]
}

func NewItemService(r repository.ItemRepository) ItemService {
	return NewResumeItemService[models.ResumeItem](r)
}
