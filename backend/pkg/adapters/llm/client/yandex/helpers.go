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
	"Всегда отвечай в формате JSON, если не указано иное."

// buildPrompts генерирует инструкции и входные данные для API.
func buildPrompts(req model.Request) (instructions, input string) {
	switch req.Mode {
	case constants.ModeResumeAnalyze:
		instructions = baseInstructions + " Проведи полный анализ резюме. " +
			"Твой ответ должен быть JSON-объектом СТРОГО следующей структуры: " +
			`{"overall_score": 0, "summary": "", "strengths": [], "weaknesses": [], "suggestions": []}.`
		input = formatResume(req.Resume)
		return

	case constants.ModeFieldAnalyze:
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

	switch mode {
	case constants.ModeResumeAnalyze:
		var analysis model.Analysis
		if err := json.Unmarshal([]byte(text), &analysis); err != nil {
			return model.Response{}, fmt.Errorf("ошибка парсинга анализа резюме: %w. Ответ API: %s", err, text)
		}
		resp.Analysis = &analysis

	case constants.ModeFieldAnalyze:
		var suggest model.FieldSuggest
		if err := json.Unmarshal([]byte(text), &suggest); err != nil {
			return model.Response{}, fmt.Errorf("ошибка парсинга предложения по полю: %w. Ответ API: %s", err, text)
		}
		resp.FieldSuggest = &suggest

	case constants.ModeAnswer:
		resp.Message = text
	}

	return resp, nil
}
