package storage

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
)

type AvatarStorage interface {
	SaveAvatar(fh *multipart.FileHeader) (string, cvaggerr.Error)
	DeleteAvatar(avatarURL string) cvaggerr.Error
}

type avatarStorage struct{}

func NewAvatarStorage() AvatarStorage {
	return &avatarStorage{}
}

func (s *avatarStorage) SaveAvatar(fh *multipart.FileHeader) (string, cvaggerr.Error) {
	if fh == nil {
		return "", cvaggerr.New("file required", "файл обязателен", 400)
	}

	uploadDir := os.Getenv("UPLOAD_DIR")
	if uploadDir == "" {
		uploadDir = "images/uploads"
	}
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		return "", cvaggerr.NewD(err)
	}

	src, err := fh.Open()
	if err != nil {
		return "", cvaggerr.NewD(err)
	}
	defer src.Close()

	rb := make([]byte, 8)
	if _, err := rand.Read(rb); err != nil {
		return "", cvaggerr.NewD(err)
	}

	ext := filepath.Ext(fh.Filename)
	filename := fmt.Sprintf("%d-%s%s", time.Now().Unix(), hex.EncodeToString(rb), ext)
	dstPath := filepath.Join(uploadDir, filename)

	dst, err := os.Create(dstPath)
	if err != nil {
		return "", cvaggerr.NewD(err)
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		return "", cvaggerr.NewD(err)
	}

	return "/images/uploads/" + filename, nil
}

func (s *avatarStorage) DeleteAvatar(avatarURL string) cvaggerr.Error {
	if avatarURL == "" {
		return nil
	}

	uploadDir := os.Getenv("UPLOAD_DIR")
	if uploadDir == "" {
		uploadDir = "images/uploads"
	}

	filename := filepath.Base(avatarURL)
	if filename == "." || filename == string(filepath.Separator) {
		return nil
	}

	avatarPath := filepath.Join(uploadDir, filename)
	if err := os.Remove(avatarPath); err != nil && !os.IsNotExist(err) {
		return cvaggerr.NewD(err)
	}

	return nil
}
