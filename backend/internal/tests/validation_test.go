package tests

import (
	"encoding/json"
	"testing"

	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/asthmatick1dd0/CVagg/internal/validation"
)

func TestValidateStruct(t *testing.T) {

	payload := &input.SignInInputEmail{}
	json.Unmarshal([]byte(`{"email":"aaa@pochta.net"}`), payload)
	errors := validation.ValidateStruct(payload)
	if errors == nil {
		t.Error("Expected validation errors: missing password field")
	}

	payload = &input.SignInInputEmail{}
	json.Unmarshal([]byte(`{"password":"qwerty"}`), payload)
	errors = validation.ValidateStruct(payload)
	if errors == nil {
		t.Error("Expected validation errors: missing email field")
	}

	payload = &input.SignInInputEmail{}
	json.Unmarshal([]byte(`{"email":"mail@example.com","password":"qwerty"}`), payload)
	errors = validation.ValidateStruct(payload)
	if len(errors) != 0 {
		t.Error("Errors not expected")
	}
}
