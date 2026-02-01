package service

import "crypto/rand"

func GenerateJWTSecret() []byte {
	token := make([]byte, 32)
	rand.Read(token)
	return token
}
