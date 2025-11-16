package service

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
)

func GenerateJWTSecret() ecdsa.PrivateKey {
	key, _ := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	return *key
}
