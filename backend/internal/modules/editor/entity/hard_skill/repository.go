package hard_skill

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/modules/editor/base"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"gorm.io/gorm"
)

type Repository interface {
	base.ResumeItemRepository[models.HardSkill]
}

func NewRepository(db *gorm.DB, logger *cvagglog.Logger) Repository {
	return base.NewResumeItemRepository[models.HardSkill](db, logger)
}
