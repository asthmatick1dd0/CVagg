package models

type HardSkillsCatalog struct {
	ID    uint   `gorm:"primarykey"`
	Skill string `json:"skill"`
}
