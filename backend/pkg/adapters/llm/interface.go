package llm

import (
	"context"

	"github.com/asthmatick1dd0/CVagg/pkg/adapters/llm/model"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
)

type LLMClient interface {
	Chat(ctx context.Context, req model.Request) (model.Response, cvaggerr.Error)
}
