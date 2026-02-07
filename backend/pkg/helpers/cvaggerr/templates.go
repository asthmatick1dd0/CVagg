package cvaggerr

import "github.com/gofiber/fiber/v2"

// All errors that don't fit into other categories
type generalErrors struct {
	Validation     Error
	InternalServer Error
	DataBase       Error
}

// Absolutely everything related to auth
type authErrors struct {
	WrongCredentials  Error
	UserAlreadyExists Error
	AlreadySignedIn   Error
	SignInFirst       Error
	BadToken          Error
}

// Errors related to accessing different parts of app, mostly resumes
type accessErrors struct {
	NotFound  Error
	Forbidden Error
}

var GeneralErrors *generalErrors = &generalErrors{
	Validation: New(
		"Provided data didn't pass validation",
		"Данные не прошли валидацию",
		fiber.StatusBadRequest),
	InternalServer: New(
		"Internal server error",
		"Внутренния ошибка сервера",
		fiber.StatusInternalServerError),
	DataBase: New(
		"Database error",
		"Ошибка в работе базы данных",
		fiber.StatusServiceUnavailable),
}

var AuthErrors *authErrors = &authErrors{
	WrongCredentials: New(
		"Incorrect email address or password",
		"Неправильные адрес почты или пароль",
		fiber.StatusBadRequest),
	UserAlreadyExists: New(
		"User with such email exists already",
		"Пользователь с такой почтой уже существует",
		fiber.StatusConflict),
	AlreadySignedIn: New(
		"Already signed in, to sign in once again log out first",
		"Повторная авторизация возможна только после разлогинивания",
		fiber.StatusForbidden),
	SignInFirst: New(
		"Following content is not available for unauthorized access",
		"Данный контент недоступен неавторизованным пользователям",
		fiber.StatusUnauthorized),
	BadToken: New(
		"JWT auth token does not exist, is empty, invalid or expired",
		"JWT токен не существует, пуст, невалиден либо просрочен",
		fiber.StatusBadRequest),
}

var AccessErrors *accessErrors = &accessErrors{
	NotFound: New(
		"The sought things be not found, nor here, nor now, at the last",
		"По данному запросу ничего не найдено",
		fiber.StatusNotFound),
	Forbidden: New(
		"Access to this content for this user is restricted",
		"К данному контенту доступ ограничен для этого пользователя",
		fiber.StatusForbidden),
}
