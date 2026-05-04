package email

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	"gopkg.in/gomail.v2"
)

type Service interface {
	SendToken(email string, token string) error
}

type SMTPConfig struct {
	Server   string
	Port     int
	Email    string
	Password string
}

func NewSMTPConfig() (*SMTPConfig, error) {
	_ = godotenv.Load()

	portStr := os.Getenv("SMTP_PORT")
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return nil, fmt.Errorf("invalid SMTP_PORT: %w", err)
	}

	cfg := &SMTPConfig{
		Server:   os.Getenv("SMTP_SERVER"),
		Port:     port,
		Email:    os.Getenv("EMAIL_ADDRESS"),
		Password: os.Getenv("EMAIL_PASSWORD"),
	}

	if cfg.Server == "" || cfg.Email == "" || cfg.Password == "" {
		return nil, fmt.Errorf("missing SMTP env vars")
	}

	return cfg, nil
}

func NewDialer(cfg *SMTPConfig) *gomail.Dialer {
	return gomail.NewDialer(
		cfg.Server,
		cfg.Port,
		cfg.Email,
		cfg.Password,
	)
}

type emailService struct {
	dialer *gomail.Dialer
	URL    string
}

func NewService(dialer *gomail.Dialer) Service {
	godotenv.Load()
	return &emailService{
		dialer: dialer,
		URL:    os.Getenv("URL"),
	}
}

// Sends AND forms the verification link
//
// URL is a string of the address where our project lives, http://localhost:8080/ or https://cvagg.ru/ for example
func (em *emailService) SendToken(email string, token string) error {
	fmt.Println("aaa")
	message := gomail.NewMessage()
	message.SetHeader("From", em.dialer.Username)
	message.SetHeader("To", email)
	message.SetHeader("Subject", "Подтверждение почты")
	message.SetBody("text/plain", fmt.Sprintf("Чтобы подтвердить свою регистрацию на %s, перейдите по ссылке: %sapi/v1/auth/verify/?token=%s", em.URL, em.URL, token))

	return em.dialer.DialAndSend(message)
}
