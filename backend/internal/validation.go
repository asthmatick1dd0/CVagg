package internal

import (
	"github.com/go-playground/validator/v10"
)

type ErrorResponse struct { // потом эти респонсы отправлять на фронт при неудачной валидации юзера
	Name    string `json:"name"`
	Tag     string `json:"tag"`
	Value   string `json:"value,omitempty"`
	Content string `json:"content,omitempty"`
}

var validate = validator.New()

func ValidateStruct[T any](payload T) []*ErrorResponse {
	errors := make([]*ErrorResponse, 0)
	err := validate.Struct(payload)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			var errElem ErrorResponse
			errElem.Name = err.StructNamespace()
			errElem.Tag = err.ActualTag()
			errElem.Value = err.Param()
			errElem.Content = err.Error()
			errors = append(errors, &errElem)
		}
	}
	return errors
}
