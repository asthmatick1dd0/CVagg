package email

import (
	"crypto/tls"
	"fmt"
	"net/url"
	"os"
	"strings"
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
	UseSSL   bool
}

func NewSMTPConfig() (*SMTPConfig, error) {
	_ = godotenv.Load()

	portStr := os.Getenv("SMTP_PORT")
	if portStr == "" {
		portStr = "465"
	}

	port, err := strconv.Atoi(portStr)
	if err != nil {
		return nil, fmt.Errorf("invalid SMTP_PORT: %w", err)
	}

	useSSL := os.Getenv("SMTP_USE_SSL") == "true"
	if os.Getenv("SMTP_USE_SSL") == "" {
		useSSL = port == 465
	}

	cfg := &SMTPConfig{
		Server:   os.Getenv("SMTP_SERVER"),
		Port:     port,
		Email:    os.Getenv("EMAIL_ADDRESS"),
		Password: os.Getenv("EMAIL_PASSWORD"),
		UseSSL:   useSSL,
	}

	if cfg.Server == "" || cfg.Email == "" || cfg.Password == "" {
		return nil, fmt.Errorf("missing SMTP env vars")
	}

	return cfg, nil
}

func NewDialer(cfg *SMTPConfig) *gomail.Dialer {
	dialer := gomail.NewDialer(
		cfg.Server,
		cfg.Port,
		cfg.Email,
		cfg.Password,
	)
	dialer.SSL = cfg.UseSSL
	dialer.TLSConfig = &tls.Config{ServerName: cfg.Server, MinVersion: tls.VersionTLS12}

	return dialer
}

type emailService struct {
	dialer *gomail.Dialer
	URL    string
	From   string
}

func NewService(dialer *gomail.Dialer) Service {
	godotenv.Load()

	from := os.Getenv("SMTP_FROM_NAME")
	if from == "" {
		from = "CVagg"
	}

	return &emailService{
		dialer: dialer,
		URL:    os.Getenv("URL"),
		From:   from,
	}
}

// Sends AND forms the verification link
//
// URL is a string of the address where our project lives, http://localhost:8080/ or https://cvagg.ru/ for example
func (em *emailService) SendToken(email string, token string) error {
	baseURL := strings.TrimSpace(em.URL)
	if baseURL == "" {
		baseURL = "http://localhost:3000"
	}

	verifyLink := fmt.Sprintf("%s/api/v1/auth/verify/?token=%s", strings.TrimRight(baseURL, "/"), url.QueryEscape(token))

	message := gomail.NewMessage()
	message.SetAddressHeader("From", em.dialer.Username, em.From)
	message.SetHeader("To", email)
	message.SetHeader("Reply-To", em.dialer.Username)
	message.SetHeader("Subject", "Подтверждение почты")
	message.SetBody("text/plain", fmt.Sprintf(
		"Здравствуйте!\n\n"+
			"Вы получили это письмо, потому что зарегистрировались в сервисе %s.\n"+
			"Подтвердите адрес электронной почты по ссылке:\n%s\n\n"+
			"Если вы не регистрировались, просто проигнорируйте это письмо.",
		em.From,
		verifyLink,
	))

	return em.dialer.DialAndSend(message)
}
