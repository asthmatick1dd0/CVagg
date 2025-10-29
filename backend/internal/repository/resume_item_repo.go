package repository

type ResumeItemRepository[T any] interface {
	BaseRepository[T]
	GetAllByResumeID(resumeId uint) ([]T, error)
}
