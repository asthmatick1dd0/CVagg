package model

import "github.com/asthmatick1dd0/CVagg/pkg/adapters/llm/constants"

// Request — это внутренняя модель, описывающая задачу для LLM-адаптера.
type Request struct {
	Mode constants.Mode `json:"mode"`

	// Сценарий 1 (полный анализ) и 2 (анализ поля)
	Resume *Resume `json:"resume"`

	// Сценарий 2 (анализ поля)
	Field *Field `json:"field"`

	// Сценарий 3 (вопрос-ответ)
	Question string `json:"question"`
}

// Resume содержит данные резюме.
type Resume struct {
	Summary    string   `json:"summary"`
	Experience string   `json:"experience"`
	Skills     []string `json:"skills"`
}

// Field описывает конкретное поле для анализа.
type Field struct {
	Type  constants.FieldType `json:"type"`
	Name  string              `json:"name"`
	Value string              `json:"value"`
}

// --- Модели для Yandex API ---

// APIRequest представляет тело запроса, отправляемое в Yandex Cloud API.
type APIRequest struct {
	Model           string  `json:"model"`
	Temperature     float64 `json:"temperature"`
	Instructions    string  `json:"instructions"`
	Input           string  `json:"input"`
	MaxOutputTokens int     `json:"max_output_tokens"`
}
