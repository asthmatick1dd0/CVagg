package llm

import (
	"context"

	"github.com/asthmatick1dd0/CVagg/pkg/adapters/llm/model"
)

type LLMClient interface {
	Chat(ctx context.Context, req model.Request) (model.Response, error)
}
