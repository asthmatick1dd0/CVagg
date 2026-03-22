package constants

type FieldType string

const (
	FieldSkills    FieldType = "skills"
	FieldAbout     FieldType = "about"
	FieldEducation FieldType = "educatuion"
	FieldCustom    FieldType = "custom"
)

type Role string

const (
	RoleSystem Role = "system"
	RoleUser   Role = "user"
)

type Mode string

const (
	ModeResumeAnalyze Mode = "resume_analyze"
	ModeFieldAnalyze  Mode = "field_analyze"
	ModeAnswer        Mode = "answer"
)

