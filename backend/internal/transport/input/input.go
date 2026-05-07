package input

type SignUpInput struct {
	Username string `json:"username" validate:"required"`
	Name     string `json:"name" validate:"required"`
	Surname  string `json:"surname" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,ascii,max=72"` // больше 72 символов нормально не хэшируется
}

type SignInInputUsername struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type SignInInputEmail struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
} // теперь тока для тестов валидации, юзверь логинится ТОЛЬКО через юз, ибо сложно и запарно
