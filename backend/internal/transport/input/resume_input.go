package input

import "time"

type ResumeInput struct {
	ID     uint                   `json:"id"`
	UserID uint                   `json:"user_id"`
	Title  string                 `json:"title"`
	Items  map[string][]ItemInput `json:"items"`
}

type ItemInput struct {
	ResumeID      uint                `json:"resume_id"`
	FieldID       uint                `json:"field_id"`
	Type          string              `json:"type"` // "education", "hard_skill", "custom"
	Education     *EducationInput     `json:"education,omitempty"`
	HardSkill     *HardSkillInput     `json:"hard_skill,omitempty"`
	About         *AboutInput         `json:"about,omitempty"`
	Custom        *CustomInput        `json:"custom,omitempty"`
	JobExperience *JobExperienceInput `json:"job_experience,omitempty"`
	PersonalData  *PersonalDataInput  `json:"personal_data,omitempty"`
}

type PersonalDataInput struct {
	DesiredJob string    `json:"desired_job"`
	FullName   string    `json:"full_name"`
	Email      string    `json:"email"`
	Phone      string    `json:"phone"`
	Address    string    `json:"address"`
	Github     string    `json:"github"`
	Website    string    `json:"website"`
	Birthdate  time.Time `json:"birthdate"`
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
	Company     string     `json:"company"`
	Position    string     `json:"position"`
	StartDate   *time.Time `json:"start_date"`
	EndDate     *time.Time `json:"end_date"`
	Description string     `json:"description"`
}

type AboutInput struct {
	About string `json:"about"`
}
