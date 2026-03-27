package yandex

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/asthmatick1dd0/CVagg/pkg/adapters/llm/model"
)

const (
	apiURL          = "https://ai.api.cloud.yandex.net/v1/responses"
	defaultModel    = "yandexgpt-5-lite/latest"
	defaultTemp     = 0.3
	maxOutputTokens = 1500
)

// Client для взаимодействия с Yandex API.
type Client struct {
	httpClient *http.Client
	apiKey     string
	folderID   string
}

// New создает новый клиент для Yandex API.
func New(apiKey, folderID string) *Client {
	return &Client{
		httpClient: &http.Client{},
		apiKey:     apiKey,
		folderID:   folderID,
	}
}

// Chat отправляет запрос к LLM и возвращает структурированный ответ.
func (c *Client) Chat(ctx context.Context, req model.Request) (model.Response, error) {
	log.Printf("[llm:yandex] chat start mode=%q has_resume=%t has_field=%t question_len=%d", req.Mode, req.Resume != nil, req.Field != nil, len(req.Question))

	if strings.TrimSpace(c.apiKey) == "" {
		log.Printf("[llm:yandex] missing YANDEX_API_KEY")
		return model.Response{}, fmt.Errorf("не задан YANDEX_API_KEY")
	}
	if strings.TrimSpace(c.folderID) == "" {
		log.Printf("[llm:yandex] missing YANDEX_FOLDER_ID")
		return model.Response{}, fmt.Errorf("не задан YANDEX_FOLDER_ID")
	}

	// 1. Формируем тело запроса к API на основе нашей внутренней модели
	apiReq := c.buildAPIRequest(req)

	// 2. Выполняем HTTP-запрос
	apiResp, err := c.doRequest(ctx, apiReq)
	if err != nil {
		log.Printf("[llm:yandex] request failed: %v", err)
		return model.Response{}, err
	}

	// 3. Извлекаем текстовый ответ из JSON ответа API
	rawText := apiResp.GetOutputText()
	if rawText == "" {
		log.Printf("[llm:yandex] empty output text from API")
		return model.Response{}, fmt.Errorf("получен пустой ответ от API")
	}

	// 4. Парсим текстовый ответ в нашу внутреннюю структуру Response
	res, err := parseResponse(rawText, req.Mode)
	if err != nil {
		log.Printf("[llm:yandex] parse failed mode=%q raw_prefix=%q err=%v", req.Mode, truncateForLog(rawText, 220), err)
		return model.Response{}, err
	}

	log.Printf("[llm:yandex] chat success mode=%q", req.Mode)
	return res, nil
}

// buildAPIRequest создает запрос к Yandex API на основе внутренней логики.
func (c *Client) buildAPIRequest(req model.Request) model.APIRequest {
	instructions, input := buildPrompts(req)

	return model.APIRequest{
		Model:           fmt.Sprintf("gpt://%s/%s", c.folderID, defaultModel),
		Temperature:     defaultTemp,
		Instructions:    instructions,
		Input:           input,
		MaxOutputTokens: maxOutputTokens,
	}
}

// doRequest выполняет HTTP-запрос к Yandex API.
func (c *Client) doRequest(ctx context.Context, apiReq model.APIRequest) (*model.APIResponse, error) {
	jsonData, err := json.Marshal(apiReq)
	if err != nil {
		return nil, fmt.Errorf("ошибка сериализации запроса: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, apiURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("ошибка создания http-запроса: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Api-Key "+c.apiKey)
	req.Header.Set("OpenAI-Project", c.folderID) // Важный заголовок для этой версии API

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("ошибка выполнения http-запроса: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("ошибка чтения тела ответа: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		log.Printf("[llm:yandex] upstream non-200 status=%d body_prefix=%q", resp.StatusCode, truncateForLog(string(body), 300))
		return nil, fmt.Errorf("API вернул статус %d: %s", resp.StatusCode, string(body))
	}

	var apiResponse model.APIResponse
	if err := json.Unmarshal(body, &apiResponse); err != nil {
		return nil, fmt.Errorf("ошибка парсинга ответа API: %w", err)
	}

	return &apiResponse, nil
}

func truncateForLog(s string, max int) string {
	if max <= 0 || len(s) <= max {
		return s
	}
	return s[:max] + "..."
}
