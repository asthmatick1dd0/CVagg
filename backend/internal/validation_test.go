package internal

import (
	"encoding/json"
	"testing"

	"github.com/asthmatick1dd0/CVagg/internal/models"
)

func TestValidateStruct(t *testing.T) {
	var payload *models.SignInInputEmail
	json.Unmarshal([]byte("{\"email\":\"aaa\"}"), &payload)
	errors := ValidateStruct(payload)
	if errors == nil {
		t.Error("Expected validation errors: missing password field")
	}
	payload = nil
	json.Unmarshal([]byte(`{"password":"qwerty"}`), &payload)
	errors = ValidateStruct(payload)
	if errors == nil {
		t.Error("Expected validation errors: missing email field")
	}
	payload = nil
	json.Unmarshal([]byte(`{"email":"mail","password":"qwerty"}`), &payload)
	errors = ValidateStruct(payload)
	if len(errors) != 0 {
		t.Error("Errors not expected")
	}
}
