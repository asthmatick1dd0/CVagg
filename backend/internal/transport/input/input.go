package input

type SignUpInput struct {
	Username string `json:"username" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type SignInInputUsername struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type SignInInputEmail struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
} // теперь тока для тестов валидации, юзверь логинится ТОЛЬКО через юз, ибо сложно и запарно
