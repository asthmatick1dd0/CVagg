package hard_skill

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
	"gorm.io/gorm"
)

type HardSkillService interface {
	SaveResumeHardSkill(tx *gorm.DB, resume *input.HardSkillInput) cvaggerr.Error
}

type hardSkillService struct {
	repo Repository
}

func NewHardSkillService(repo Repository) HardSkillService {
	return &hardSkillService{
		repo: repo,
	}
}

func (s *hardSkillService) SaveResumeHardSkill(tx *gorm.DB, resume *input.HardSkillInput) cvaggerr.Error {
	hardSkillModel := &models.HardSkill{
		SkillId: resume.SkillID,
	}

	return s.repo.Create(tx, hardSkillModel)
}
