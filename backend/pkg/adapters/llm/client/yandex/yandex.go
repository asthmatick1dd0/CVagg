package yandex

import (
	"context"
	"net/http"

	"github.com/asthmatick1dd0/CVagg/pkg/adapters/llm"
	"github.com/asthmatick1dd0/CVagg/pkg/adapters/llm/model"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
)

type yandexClient struct {
	http     *http.Client
	apiKey   string
	folderID string
	model    string
}

func NewYandex(apiKey, model, folderId string) llm.LLMClient {
	return &yandexClient{
		http:     &http.Client{},
		apiKey:   apiKey,
		folderID: folderId,
		model:    model,
	}
}

func (ya *yandexClient) Chat(ctx context.Context, req model.RequestBody) (model.ResponseBody, cvaggerr.Error) {
}
