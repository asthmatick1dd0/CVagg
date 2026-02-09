package cvaggerr

import "github.com/gofiber/fiber/v2"

// General
func ErrorValidation() Error {
	return New(
		"Provided data didn't pass validation",
		"Данные не прошли валидацию",
		fiber.StatusBadRequest,
	)
}

func ErrorInternalServer() Error {
	return New(
		"Internal server error",
		"Внутренняя ошибка сервера",
		fiber.StatusInternalServerError,
	)
}

func ErrorDataBase() Error {
	return New(
		"Database error",
		"Ошибка в работе базы данных",
		fiber.StatusServiceUnavailable,
	)
}

// Auth
func ErrorWrongCredentials() Error {
	return New(
		"Incorrect email address or password",
		"Неправильные адрес почты или пароль",
		fiber.StatusBadRequest,
	)
}

func ErrorUserAlreadyExists() Error {
	return New(
		"User with such email exists already",
		"Пользователь с такой почтой уже существует",
		fiber.StatusConflict,
	)
}

func ErrorAlreadySignedIn() Error {
	return New(
		"Already signed in, to sign in once again log out first",
		"Повторная авторизация возможна только после разлогинивания",
		fiber.StatusForbidden,
	)
}

func ErrorSignInFirst() Error {
	return New(
		"Following content is not available for unauthorized access",
		"Данный контент недоступен неавторизованным пользователям",
		fiber.StatusUnauthorized,
	)
}

func ErrorBadToken() Error {
	return New(
		"JWT auth token does not exist, is empty, invalid or expired",
		"JWT токен не существует, пуст, невалиден либо просрочен",
		fiber.StatusBadRequest,
	)
}

// Access
func ErrorNotFound() Error {
	return New(
		"The sought things be not found, nor here, nor now, at the last",
		"По данному запросу ничего не найдено",
		fiber.StatusNotFound,
	)
}

func ErrorForbidden() Error {
	return New(
		"Access to this content for this user is restricted",
		"К данному контенту доступ ограничен для этого пользователя",
		fiber.StatusForbidden,
	)
}
