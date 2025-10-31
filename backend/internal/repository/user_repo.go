package repository

import (
	"gorm.io/gorm"

	"github.com/asthmatick1dd0/CVagg/backend/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/models"
)

type UserRepository interface {
	Create(u *models.User) error
	GetByID(id uint) (*models.User, error)
	Update(u *models.User) error
	Delete(id uint) error
}

type userRepo struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepo{db}
}

func (r *userRepo) Create(u *models.User) error {
	return r.db.Create(u).Error
}

func (r *userRepo) GetById(id uint) (*models.User, error) {
	var user models.User
	if err := r.db.First(&user, id).Error; err != nil {

	}
}
