package repository

type BaseRepository[T any] interface {
	Create(entity *T) error
	GetById(id uint) (*T, error)
	Update(entity *T) error
	Delete(id uint) error
}
