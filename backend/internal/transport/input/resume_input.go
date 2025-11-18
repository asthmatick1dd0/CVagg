package input

import "time"

type ResumeInput struct {
	ID     uint                   `json:"id"`
	UserID uint                   `json:"user_id"`
	Title  string                 `json:"title"`
	Items  map[string][]ItemInput `json:"items"`
}

type ItemInput struct {
	Type          string              `json:"type"` // "education", "hard_skill", "custom"
	Education     *EducationInput     `json:"education,omitempty"`
	HardSkill     *HardSkillInput     `json:"hard_skill,omitempty"`
	Custom        *CustomInput        `json:"custom,omitempty"`
	JobExperience *JobExperienceInput `json:"job_experience,omitempty"`
}

type EducationInput struct {
	University string     `json:"university"`
	Faculty    string     `json:"faculty"`
	Degree     string     `json:"degree"`
	Major      string     `json:"major"`
	StartDate  time.Time  `json:"start_date"`
	EndDate    *time.Time `json:"end_date"`
	Finished   bool       `json:"finished"`
}

type HardSkillInput struct {
	SkillID uint `json:"skill_id"`
}

type CustomInput struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

type JobExperienceInput struct {
	Company   string `json:"company"`
	Position  string `json:"position"`
	StartDate uint   `json:"start_date"`
	EndDate   uint   `json:"end_date"`
}

type AboutInput struct {
	About string `json:"about"`
}
