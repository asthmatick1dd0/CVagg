package yandex

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/asthmatick1dd0/CVagg/pkg/adapters/llm/constants"
	"github.com/asthmatick1dd0/CVagg/pkg/adapters/llm/model"
)

const baseInstructions = "Ты — русскоязычный ИИ-ассистент для помощи в составлении резюме. " +
	"Твоя задача — анализировать резюме, предлагать улучшения и отвечать на вопросы, связанные с карьерой. " +
	"Не отвечай ни на что не связанное напрямую с разработкой ПО, программированием и поиском работы" +
	"Всегда отвечай в формате JSON, если не указано иное."

// buildPrompts генерирует инструкции и входные данные для API.
func buildPrompts(req model.Request) (instructions, input string) {
	switch req.Mode {
	case constants.ModeResumeAnalyze:
		instructions = baseInstructions + " Проведи полный анализ резюме. " +
			"Твой ответ должен быть JSON-объектом СТРОГО следующей структуры: " +
			`{"overall_score": 0, "summary": "", "strengths": [], "weaknesses": [], "suggestions": []}.` +
			"overall_score должен быть от 0 до 100. Оценивай строго, но не слишком." +
			"в strengths не пиши все навыки пользовтеля, только то что действительно может его выделить"
		input = formatResume(req.Resume)
		return

	case constants.ModeFieldAnalyze:
		if req.Field == nil {
			instructions = baseInstructions + " Проанализируй одно поле в резюме."
			input = "Ошибка входных данных: поле для анализа не передано."
			return
		}

		instructions = baseInstructions + " Проанализируй одно поле в резюме. " +
			"Твой ответ должен быть JSON-объектом СТРОГО следующей структуры: " +
			`{"message": "", "suggested_text": ""}.`
		input = fmt.Sprintf(
			"Поле для улучшения: '%s'.\nТекущее значение: '%s'.\n\nПолное резюме для контекста:\n%s",
			req.Field.Name, req.Field.Value, formatResume(req.Resume),
		)
		return

	case constants.ModeAnswer:
		// Для простого ответа не просим JSON, а просто отвечаем на вопрос.
		instructions = "Ты — русскоязычный ИИ-ассистент для помощи в составлении резюме. Отвечай кратко и по делу."
		input = req.Question
		return
	}
	return baseInstructions, req.Question // Поведение по умолчанию
}

// formatResume преобразует структуру Resume в строку.
func formatResume(r *model.Resume) string {
	if r == nil {
		return "Резюме не предоставлено."
	}
	return fmt.Sprintf(
		"Обо мне: %s\n\nОпыт работы:\n%s\n\nКлючевые навыки: %s",
		r.Summary, r.Experience, strings.Join(r.Skills, ", "),
	)
}

// parseResponse парсит текстовый ответ от API в нужную внутреннюю структуру.
func parseResponse(text string, mode constants.Mode) (model.Response, error) {
	resp := model.Response{Mode: mode}
	raw := normalizeJSONText(text)

	switch mode {
	case constants.ModeResumeAnalyze:
		var analysis model.Analysis
		if err := json.Unmarshal([]byte(raw), &analysis); err != nil {
			return model.Response{}, fmt.Errorf("ошибка парсинга анализа резюме: %w. Ответ API: %s", err, text)
		}
		resp.Analysis = &analysis

	case constants.ModeFieldAnalyze:
		var suggest struct {
			Message       string `json:"message"`
			SuggestText   string `json:"suggest_text"`
			SuggestedText string `json:"suggested_text"`
		}
		if err := json.Unmarshal([]byte(raw), &suggest); err != nil {
			return model.Response{}, fmt.Errorf("ошибка парсинга предложения по полю: %w. Ответ API: %s", err, text)
		}
		out := &model.FieldSuggest{
			Message:       suggest.Message,
			SuggestedText: suggest.SuggestText,
		}
		if out.SuggestedText == "" {
			out.SuggestedText = suggest.SuggestedText
		}
		resp.FieldSuggest = out

	case constants.ModeAnswer:
		resp.Message = text
	}

	return resp, nil
}

func normalizeJSONText(text string) string {
	s := strings.TrimSpace(text)

	// LLM часто оборачивает JSON в markdown-блоки ```json ... ```
	s = strings.TrimPrefix(s, "```json")
	s = strings.TrimPrefix(s, "```JSON")
	s = strings.TrimPrefix(s, "```")
	s = strings.TrimSuffix(s, "```")
	s = strings.TrimSpace(s)

	start := strings.Index(s, "{")
	end := strings.LastIndex(s, "}")
	if start >= 0 && end >= 0 && end >= start {
		return s[start : end+1]
	}

	return s
}
