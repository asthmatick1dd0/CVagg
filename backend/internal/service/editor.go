package service

import (
	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
)

type EditorService interface {
	SaveResume(resume *input.ResumeInput) error
}

type editorService struct {
	resumeRepo     repository.ResumeRepository
	resumeItemRepo repository.ItemRepository
	jobExpRepo     repository.JobExperienceRepository
	educationRepo  repository.EducationRepository
	hardSkillRepo  repository.HardSkillRepository
	aboutRepo      repository.AboutRepository
	customRepo     repository.CustomRepository
}

func NewEditorService(
	resumeRepo repository.ResumeRepository,
	resumeItemRepo repository.ItemRepository,
	jobExpRepo repository.JobExperienceRepository,
	educationRepo repository.EducationRepository,
	hardSkillRepo repository.HardSkillRepository,
	aboutRepo repository.AboutRepository,
	customRepo repository.CustomRepository,
) EditorService {
	return &editorService{
		resumeRepo:     resumeRepo,
		resumeItemRepo: resumeItemRepo,
		jobExpRepo:     jobExpRepo,
		educationRepo:  educationRepo,
		hardSkillRepo:  hardSkillRepo,
		aboutRepo:      aboutRepo,
		customRepo:     customRepo,
	}
}

func (s *editorService) SaveResume(resume *input.ResumeInput) error {
	resumeInput := &models.Resume{
		Title:  resume.Title,
		UserID: resume.UserID,
	}
	if err := s.resumeRepo.Create(resumeInput); err != nil {
		return err
	}

	for section, items := range resume.Items {
		switch section {
		case "jobexperience":
			for _, it := range items {
				jobExpInput := &models.JobExperience{
					Company:   it.JobExperience.Company,
					Position:  it.JobExperience.Position,
					StartDate: it.JobExperience.StartDate,
					EndDate:   it.JobExperience.EndDate,
				}
				if err := s.jobExpRepo.Create(jobExpInput); err != nil {
					return err
				}
			}
		case "education":
			for _, it := range items {
				eduInput := &models.Education{
					University: it.Education.University,
					Faculty:    it.Education.Faculty,
					Degree:     it.Education.Degree,
					Major:      it.Education.Major,
					StartDate:  it.Education.StartDate,
					EndDate:    it.Education.EndDate,
					Finished:   it.Education.Finished,
				}
				if err := s.educationRepo.Create(eduInput); err != nil {
					return err
				}
			}
		case "hardskill":
			for _, it := range items {
				hardSkillInput := &models.HardSkill{
					SkillId: it.HardSkill.SkillID,
				}
				if err := s.hardSkillRepo.Create(hardSkillInput); err != nil {
					return err
				}
			}
		case "about":
			for _, it := range items {
				aboutInput := &models.About{
					About: it.About.About,
				}
				if err := s.aboutRepo.Create(aboutInput); err != nil {
					return err
				}
			}
		case "custom":
			for _, it := range items {
				customInput := &models.Custom{
					Title:   it.Custom.Title,
					Content: it.Custom.Content,
				}
				if err := s.customRepo.Create(customInput); err != nil {
					return err
				}
			}
		}
	}
}
