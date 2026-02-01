// package validation for validating input data
package validation

import (
	"github.com/go-playground/validator/v10"
)

type errorresponse struct { // потом эти респонсы отправлять на фронт при неудачной валидации юзера
	name    string `json:"name"`
	tag     string `json:"tag"`
	value   string `json:"value,omitempty"`
	content string `json:"content,omitempty"`
}

var validate = validator.new()

// при проверке на ошибки проверять не errs == nil а len(errs) == 0
func validatestruct[t any](payload t) []*errorresponse {
	errors := make([]*errorresponse, 0)
	err := validate.struct(payload)
	if err != nil {
		for _, err := range err.(validator.validationerrors) {
			var errelem errorresponse
			errelem.name = err.structnamespace()
			errelem.tag = err.actualtag()
			errelem.value = err.param()
			errelem.content = err.error()
			errors = append(errors, &errelem)
		}
	}
	return errors
}
