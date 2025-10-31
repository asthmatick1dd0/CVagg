package repository

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	BaseRepository[models.User]
	ExistsByEmail(email string) (bool, error)
	GetByEmail(email string) (*models.User, error)
	ResetPassword(email string, newPassword string) error
}

type userRepo struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepo{db}
}

func (r *userRepo) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *userRepo) GetById(id uint) (*models.User, error) {
	var user models.User
	if err := r.db.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepo) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *userRepo) Delete(id uint) error {
	return r.db.Where("id = ?", id).Delete(&models.User{}).Error
}

// Для проверки существования пользователя по email
func (r *userRepo) ExistsByEmail(email string) (bool, error) {
	var count int64
	if err := r.db.Model(&models.User{}).Where("email = ?", email).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// Получаем entity для проверки пароля допустим
func (r *userRepo) GetByEmail(email string) (*models.User, error) {
	var user models.User
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepo) ResetPassword(email string, newPassword string) error {
	user, err := r.GetByEmail(email)
	if err != nil {
		return err
	}
	// TODO: Прохешировать пароль прежде чем класть его в базу данных
	user.PasswordHash = newPassword
	return r.Update(user)
}
