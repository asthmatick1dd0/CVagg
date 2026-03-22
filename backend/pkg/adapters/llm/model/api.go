package model

import "github.com/asthmatick1dd0/CVagg/pkg/adapters/llm/constants"

type RequestBody struct {
	Model              string `json:"model"`
	Instructions       string `json:"instructions"`
	Input              string `json:"input"`
	PreviousResponseID string `json:"previous_response_id,omitempty"`
}

type ResponseBody struct {
	ID     string        `json:"id"`
	Output []OutputBlock `json:"output"`
}

type OutputBlock struct {
	Type    string         `json:"type"`
	Content []ContentBlock `json:"content"`
}

type ContentBlock struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type Response struct {
	Mode         constants.Mode
	ResponseID   string
	Analysis     *Analysis
	FieldSuggest *FieldSuggest
	Message      string
}

type Analysis struct {
	OverallScore int
	Summary      string
	Strengths    []string
	Weaknesses   []string
	Suggestions  []string
}

type FieldSuggest struct {
	FieldType    constants.FieldType
	Message      string
	SuggesteText string
}
