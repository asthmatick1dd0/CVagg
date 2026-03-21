package education

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/modules/editor/base"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"gorm.io/gorm"
)

type Repository interface {
	base.ResumeItemRepository[models.Education]
}

func NewRepository(db *gorm.DB, logger *cvagglog.Logger) Repository {
	return base.NewResumeItemRepository[models.Education](db, logger)
}
