package email

import (
	"fmt"
	"os"
	"strconv"

	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvagglog"
	"github.com/joho/godotenv"
	"gopkg.in/gomail.v2"
)

type Service interface {
	Start() error
	SendToken(email string, url string, token string) error
}

type emailService struct {
	dialer *gomail.Dialer
	logger *cvagglog.Logger
}

func NewEmailer(dialer *gomail.Dialer, logger *cvagglog.Logger) Service {
	return &emailService{
		dialer: dialer,
		logger: logger,
	}
}

func (em *emailService) Start() error {
	err := godotenv.Load()
	if err != nil {
		return err
	}

	port, _ := strconv.Atoi(os.Getenv("SMTP_PORT"))
	em.dialer = gomail.NewDialer(os.Getenv("SMTP_SERVER"), port, os.Getenv("EMAIL_ADDRESS"), os.Getenv("EMAIL_PASSWORD"))

	return err
}

// Sends AND forms the verification link
//
// URL is a string of the address where our project lives, http://localhost:8080/ or https://cvagg.ru/ for example
func (em *emailService) SendToken(email string, url string, token string) error {
	message := gomail.NewMessage()
	message.SetHeader("From", em.dialer.Username)
	message.SetHeader("To", email)
	message.SetHeader("Subject", "Подтверждение почты")
	message.SetBody("text/plain", fmt.Sprintf("Чтобы подтвердить свою регистрацию на %s, перейдите по ссылке: %sapi/v1/auth/verify?token=%s", url, url, token))

	return em.dialer.DialAndSend(message)
}
