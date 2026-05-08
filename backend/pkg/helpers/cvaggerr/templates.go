package cvaggerr

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

// General
func ErrorValidation() Error {
	return &err{
		English:   "Provided data didn't pass validation",
		Russian:   "Данные не прошли валидацию",
		errorCode: fiber.StatusBadRequest,
	}
}

func ErrorInternalServer() Error {
	return &err{
		English:   "Internal server error",
		Russian:   "Внутренняя ошибка сервера",
		errorCode: fiber.StatusInternalServerError,
	}
}

func ErrorDataBase() Error {
	return &err{
		English:   "Database error",
		Russian:   "Ошибка в работе базы данных",
		errorCode: fiber.StatusServiceUnavailable,
	}
}

// Auth
func ErrorWrongCredentials() Error {
	return &err{
		English:   "Incorrect email address or password",
		Russian:   "Неправильные адрес почты или пароль",
		errorCode: fiber.StatusBadRequest,
	}
}

func ErrorUserAlreadyExists() Error {
	return &err{
		English:   "User with such email exists already",
		Russian:   "Пользователь с такой почтой уже существует",
		errorCode: fiber.StatusConflict,
	}
}

func ErrorAlreadySignedIn() Error {
	return &err{
		English:   "Already signed in, to sign in once again log out first",
		Russian:   "Повторная авторизация возможна только после разлогинивания",
		errorCode: fiber.StatusForbidden,
	}
}

func ErrorSignInFirst() Error {
	return &err{
		English:   "Following content is not available for unauthorized access",
		Russian:   "Данный контент недоступен неавторизованным пользователям",
		errorCode: fiber.StatusUnauthorized,
	}
}

func ErrorBadToken() Error {
	return &err{
		English:   "JWT auth token does not exist, is empty, invalid or expired",
		Russian:   "JWT токен не существует, пуст, невалиден либо просрочен",
		errorCode: fiber.StatusBadRequest,
	}
}

// Access
func ErrorNotFound() Error {
	return &err{
		English:   "The sought things be not found, nor here, nor now, at the last",
		Russian:   "По данному запросу ничего не найдено",
		errorCode: fiber.StatusNotFound,
	}
}

func ErrorForbidden() Error {
	return &err{
		English:   "Access to this content for this user is restricted",
		Russian:   "К данному контенту доступ ограничен для этого пользователя",
		errorCode: fiber.StatusForbidden,
	}
}

func ErrorWrongID() Error {
	return &err{
		English:   "Wrond ID parameter",
		Russian:   "Неправильный параметр ID",
		errorCode: fiber.StatusBadRequest,
	}
}

func ErrorCooldown(remaining time.Duration) Error {
	if remaining < time.Second {
		remaining = time.Second
	}
	seconds := int((remaining + time.Second - 1) / time.Second)

	return &err{
		English:   fmt.Sprintf("Try again in %d seconds", seconds),
		Russian:   fmt.Sprintf("Следующий запрос можно отправить через %d сек.", seconds),
		errorCode: fiber.StatusTooManyRequests,
	}
}
