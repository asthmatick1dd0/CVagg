package model

import "github.com/asthmatick1dd0/CVagg/pkg/adapters/llm/constants"

// Response — это унифицированный внутренний ответ от LLM-адаптера.
type Response struct {
	Mode         constants.Mode
	Message      string        // Для сценария 3 (вопрос-ответ)
	Analysis     *Analysis     // Для сценария 1 (полный анализ)
	FieldSuggest *FieldSuggest // Для сценария 2 (анализ поля)
}

// Analysis содержит детальный разбор резюме.
type Analysis struct {
	OverallScore int      `json:"overall_score"`
	Summary      string   `json:"summary"`
	Strengths    []string `json:"strengths"`
	Weaknesses   []string `json:"weaknesses"`
	Suggestions  []string `json:"suggestions"`
}

// FieldSuggest содержит рекомендации для конкретного поля резюме.
type FieldSuggest struct {
	Message       string `json:"message"`
	SuggestedText string `json:"suggest_text"`
}

// --- Модели для Yandex API ---

// APIResponse представляет структуру ответа от Yandex Cloud API.
type APIResponse struct {
	Output []struct {
		Content []struct {
			Text string `json:"text"`
		} `json:"content"`
	} `json:"output"`
}

// GetOutputText извлекает первый непустой текстовый результат из ответа API.
func (r *APIResponse) GetOutputText() string {
	if r != nil {
		for _, output := range r.Output {
			if len(output.Content) > 0 {
				return output.Content[0].Text
			}
		}
	}
	return ""
}
