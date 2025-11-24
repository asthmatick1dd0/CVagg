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
				if err := s.SaveJobExperience(&it); err != nil {
					return err
				}
			}
		case "education":
			for _, it := range items {
				if err := s.SaveEducation(&it); err != nil {
					return err
				}
			}
		case "hardskill":
			for _, it := range items {
				if err := s.SaveHardSkill(&it); err != nil {
					return err
				}
			}
		case "about":
			for _, it := range items {
				if err := s.SaveAbout(&it); err != nil {
					return err
				}
			}
		case "custom":
			for _, it := range items {
				if err := s.SaveCustom(&it); err != nil {
					return err
				}
			}
		}
	}
	return nil
}

func (s *editorService) SaveJobExperience(it *input.ItemInput) error {
	jobExpModel := &models.JobExperience{
		Company:   it.JobExperience.Company,
		Position:  it.JobExperience.Position,
		StartDate: it.JobExperience.StartDate,
		EndDate:   it.JobExperience.EndDate,
		Item: models.Item{
			ResumeId: it.ResumeID,
			UserId:   it.UserID,
		},
	}
	if err := s.jobExpRepo.Create(jobExpModel); err != nil {
		return err
	}

	resumeItemModel := &models.ResumeItem{
		ItemId:   jobExpModel.ID,
		ItemType: it.Type,

		ResumeId: it.ResumeID,
	}
	if err := s.resumeItemRepo.Create(resumeItemModel); err != nil {
		return err
	}

	return nil
}

func (s *editorService) SaveEducation(it *input.ItemInput) error {
	educationModel := &models.Education{
		University: it.Education.University,
		Faculty:    it.Education.Faculty,
		Degree:     it.Education.Degree,
		Major:      it.Education.Major,
		StartDate:  it.Education.StartDate,
		EndDate:    it.Education.EndDate,
		Finished:   it.Education.Finished,
		Item: models.Item{
			ResumeId: it.ResumeID,
			UserId:   it.UserID,
		},
	}
	if err := s.educationRepo.Create(educationModel); err != nil {
		return err
	}

	resumeItemModel := &models.ResumeItem{
		ItemId:   educationModel.ID,
		ItemType: it.Type,

		ResumeId: it.ResumeID,
	}
	if err := s.resumeItemRepo.Create(resumeItemModel); err != nil {
		return err
	}

	return nil
}

func (s *editorService) SaveHardSkill(it *input.ItemInput) error {
	hardSkillModel := &models.HardSkill{
		SkillId: it.HardSkill.SkillID,
		Item: models.Item{
			ResumeId: it.ResumeID,
			UserId:   it.UserID,
		},
	}
	if err := s.hardSkillRepo.Create(hardSkillModel); err != nil {
		return err
	}

	resumeItemModel := &models.ResumeItem{
		ItemType: it.Type,
		ItemId:   hardSkillModel.ID,

		ResumeId: it.ResumeID,
	}
	if err := s.resumeItemRepo.Create(resumeItemModel); err != nil {
		return err
	}

	return nil
}

func (s *editorService) SaveAbout(it *input.ItemInput) error {
	aboutModel := &models.About{
		About: it.About.About,
		Item: models.Item{
			ResumeId: it.ResumeID,
			UserId:   it.UserID,
		}}
	if err := s.aboutRepo.Create(aboutModel); err != nil {
		return err
	}

	resumeItemInput := &models.ResumeItem{
		ItemType: it.Type,
		ItemId:   aboutModel.ID,

		ResumeId: it.ResumeID,
	}
	if err := s.resumeItemRepo.Create(resumeItemInput); err != nil {
		return err
	}

	return nil
}

func (s *editorService) SaveCustom(it *input.ItemInput) error {
	customModel := &models.Custom{
		Title:   it.Custom.Title,
		Content: it.Custom.Content,
	}
	if err := s.customRepo.Create(customModel); err != nil {
		return err
	}

	resumeItemModel := &models.ResumeItem{
		ItemType: it.Type,
		ItemId:   customModel.ID,

		ResumeId: it.ResumeID,
	}
	if err := s.resumeItemRepo.Create(resumeItemModel); err != nil {
		return err
	}

	return nil
}
