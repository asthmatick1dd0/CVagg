// Package repository for grabbing and putting data from/to database
package user

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"gorm.io/gorm"
)

type Repository interface {
	Create(user *models.User) error
	GetByID(id uint) (*models.User, error)
	Update(user *models.User) error
	Delete(id uint) error
	ExistsByEmail(email string) (bool, error)
	GetByEmail(email string) (*models.User, error)
	ResetPassword(email string, newPassword string) error
}

type userRepository struct {
	db     *gorm.DB
	logger *cvagglog.Logger
}

func NewRepository(db *gorm.DB, logger *cvagglog.Logger) Repository {
	return &userRepository{
		db:     db,
		logger: logger,
	}
}

func (r *userRepository) Create(user *models.User) error {
	return r.db.Table("users.profile").
		Create(user).Error
}

func (r *userRepository) GetByID(id uint) (*models.User, error) {
	var user models.User
	if err := r.db.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *userRepository) Delete(id uint) error {
	return r.db.Where("id = ?", id).Delete(&models.User{}).Error
}

// Для проверки существования пользователя по email
func (r *userRepository) ExistsByEmail(email string) (bool, error) {
	var count int64
	if err := r.db.Table("users.profile").Where("email = ?", email).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// Получаем entity для проверки пароля допустим
func (r *userRepository) GetByEmail(email string) (*models.User, error) {
	var user models.User
	if err := r.db.Table("users.profile").Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) ResetPassword(email string, newPassword string) error {
	user, err := r.GetByEmail(email)
	if err != nil {
		return err
	}
	// TODO: Прохешировать пароль прежде чем класть его в базу данных
	user.PasswordHash = newPassword
	return r.Update(user)
}
