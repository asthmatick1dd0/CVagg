package service

import (
	"fmt"

	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
)

type EditorService interface {
	SaveResume(resume *input.ResumeInput) error
	GetResumeByID(id uint) (*input.ResumeInput, error)
}

type editorService struct {
	resumeRepo       repository.ResumeRepository
	resumeItemRepo   repository.ItemRepository
	jobExpRepo       repository.JobExperienceRepository
	educationRepo    repository.EducationRepository
	hardSkillRepo    repository.HardSkillRepository
	aboutRepo        repository.AboutRepository
	customRepo       repository.CustomRepository
	personalDataRepo repository.PersonalDataRepository
}

func NewEditorService(
	resumeRepo repository.ResumeRepository,
	resumeItemRepo repository.ItemRepository,
	jobExpRepo repository.JobExperienceRepository,
	educationRepo repository.EducationRepository,
	hardSkillRepo repository.HardSkillRepository,
	aboutRepo repository.AboutRepository,
	customRepo repository.CustomRepository,
	personalDataRepo repository.PersonalDataRepository,
) EditorService {
	return &editorService{
		resumeRepo:       resumeRepo,
		resumeItemRepo:   resumeItemRepo,
		jobExpRepo:       jobExpRepo,
		educationRepo:    educationRepo,
		hardSkillRepo:    hardSkillRepo,
		aboutRepo:        aboutRepo,
		customRepo:       customRepo,
		personalDataRepo: personalDataRepo,
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

	// проходимся по мапе и обрабатываем []Items исходя из ключа
	for section, items := range resume.Items {
		// TODO [CVAGG-59] Переписать этот монструозный свитч в мапу
		switch section {
		case "jobexperience":
			// здесь проходимся по массиву Items
			// поскольку в одном резюме может быть множество, допустим, опыта работы, то у нас в каждой секции лежит массив
			for _, it := range items {
				if err := s.SaveJobExperience(&it, resumeInput.ID); err != nil {
					return err
				}
			}
		case "education":
			for _, it := range items {
				if err := s.SaveEducation(&it, resumeInput.ID); err != nil {
					return err
				}
			}
		case "hardskill":
			for _, it := range items {
				if err := s.SaveHardSkill(&it, resumeInput.ID); err != nil {
					return err
				}
			}
		case "about":
			for _, it := range items {
				if err := s.SaveAbout(&it, resumeInput.ID); err != nil {
					return err
				}
			}
		case "custom":
			for _, it := range items {
				if err := s.SaveCustom(&it, resumeInput.ID); err != nil {
					return err
				}
			}
		case "PersonalData":
			for _, it := range items {
				if err := s.SavePersonalData(&it, resumeInput.ID); err != nil {
					return err
				}
			}
		}
	}
	return nil
}

// TODO [CVAGG-56] Сделать отдельную функцию SaveResumeItem чтобы много раз не повторяться

func (s *editorService) SaveJobExperience(it *input.ItemInput, ID uint) error {
	jobExpModel := &models.JobExperience{
		Company:   it.JobExperience.Company,
		Position:  it.JobExperience.Position,
		StartDate: it.JobExperience.StartDate,
		EndDate:   it.JobExperience.EndDate,
	}

	if err := s.jobExpRepo.Create(jobExpModel); err != nil {
		return err
	}

	resumeItemModel := &models.ResumeItem{
		ItemId:   jobExpModel.ID,
		ItemType: it.Type,

		ResumeId: ID,
	}
	if err := s.resumeItemRepo.Create(resumeItemModel); err != nil {
		return err
	}

	return nil
}

func (s *editorService) SavePersonalData(it *input.ItemInput, ID uint) error {
	personalDataModel := &models.PersonalData{
		FullName: it.PersonalData.FullName,
		Email:    it.PersonalData.Email,
		Phone:    it.PersonalData.Phone,
		Address:  it.PersonalData.Address,
	}

	if err := s.personalDataRepo.Create(personalDataModel); err != nil {
		return err
	}

	resumeItemModel := &models.ResumeItem{
		ItemType: it.Type,
		ItemId:   personalDataModel.ID,

		ResumeId: ID,
	}
	if err := s.resumeItemRepo.Create(resumeItemModel); err != nil {
		return err
	}

	return nil
}

func (s *editorService) SaveEducation(it *input.ItemInput, ID uint) error {
	educationModel := &models.Education{
		University: it.Education.University,
		Faculty:    it.Education.Faculty,
		Degree:     it.Education.Degree,
		Major:      it.Education.Major,
		StartDate:  it.Education.StartDate,
		EndDate:    it.Education.EndDate,
		Finished:   it.Education.Finished,
	}

	if err := s.educationRepo.Create(educationModel); err != nil {
		return err
	}

	resumeItemModel := &models.ResumeItem{
		ItemId:   educationModel.ID,
		ItemType: it.Type,

		ResumeId: ID,
	}
	if err := s.resumeItemRepo.Create(resumeItemModel); err != nil {
		return err
	}

	return nil
}

func (s *editorService) SaveHardSkill(it *input.ItemInput, ID uint) error {
	hardSkillModel := &models.HardSkill{
		SkillId: it.HardSkill.SkillID,
	}

	if err := s.hardSkillRepo.Create(hardSkillModel); err != nil {
		return err
	}

	resumeItemModel := &models.ResumeItem{
		ItemType: it.Type,
		ItemId:   hardSkillModel.ID,

		ResumeId: ID,
	}
	if err := s.resumeItemRepo.Create(resumeItemModel); err != nil {
		return err
	}

	return nil
}

func (s *editorService) SaveAbout(it *input.ItemInput, ID uint) error {
	aboutModel := &models.About{
		About: it.About.About,
	}

	if err := s.aboutRepo.Create(aboutModel); err != nil {
		return err
	}

	resumeItemInput := &models.ResumeItem{
		ItemType: it.Type,
		ItemId:   aboutModel.ID,

		ResumeId: ID,
	}
	if err := s.resumeItemRepo.Create(resumeItemInput); err != nil {
		return err
	}

	return nil
}

func (s *editorService) SaveCustom(it *input.ItemInput, ID uint) error {
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

		ResumeId: ID,
	}
	if err := s.resumeItemRepo.Create(resumeItemModel); err != nil {
		return err
	}

	return nil
}

func (s *editorService) GetResumeByID(id uint) (*input.ResumeInput, error) {
	resumeModel, err := s.resumeRepo.GetById(id)
	if err != nil {
		return nil, err
	}

	resume := &input.ResumeInput{
		ID:     resumeModel.ID,
		UserID: resumeModel.UserID,
		Title:  resumeModel.Title,
		Items:  make(map[string][]input.ItemInput),
	}

	items, err := s.resumeItemRepo.GetAllByResumeID(id)
	if err != nil {
		return nil, err
	}

	loaders := map[string]func(itemID uint) (*input.ItemInput, error){
		"jobexperience": func(itemID uint) (*input.ItemInput, error) {
			model, err := s.jobExpRepo.GetById(itemID)
			if err != nil {
				return nil, err
			}

			return &input.ItemInput{
				Type:     "jobexperience",
				FieldID:  model.ID,
				ResumeID: id,
				JobExperience: &input.JobExperienceInput{
					Company:   model.Company,
					Position:  model.Position,
					StartDate: model.StartDate,
					EndDate:   model.EndDate,
				},
			}, nil
		},

		"education": func(itemID uint) (*input.ItemInput, error) {
			model, err := s.educationRepo.GetById(itemID)
			if err != nil {
				return nil, err
			}

			return &input.ItemInput{
				Type:     "education",
				FieldID:  model.ID,
				ResumeID: id,
				Education: &input.EducationInput{
					University: model.University,
					Faculty:    model.Faculty,
					Degree:     model.Degree,
					Major:      model.Major,
					StartDate:  model.StartDate,
					EndDate:    model.EndDate,
					Finished:   model.Finished,
				},
			}, nil
		},

		"hardskill": func(itemID uint) (*input.ItemInput, error) {
			model, err := s.hardSkillRepo.GetById(itemID)
			if err != nil {
				return nil, err
			}

			return &input.ItemInput{
				Type:     "hardskill",
				FieldID:  model.ID,
				ResumeID: id,
				HardSkill: &input.HardSkillInput{
					SkillID: model.SkillId,
				},
			}, nil
		},

		"about": func(itemID uint) (*input.ItemInput, error) {
			model, err := s.aboutRepo.GetById(itemID)
			if err != nil {
				return nil, err
			}

			return &input.ItemInput{
				Type:     "about",
				FieldID:  model.ID,
				ResumeID: id,
				About: &input.AboutInput{
					About: model.About,
				},
			}, nil
		},

		"custom": func(itemID uint) (*input.ItemInput, error) {
			model, err := s.customRepo.GetById(itemID)
			if err != nil {
				return nil, err
			}

			return &input.ItemInput{
				Type:     "custom",
				FieldID:  model.ID,
				ResumeID: id,
				Custom: &input.CustomInput{
					Title:   model.Title,
					Content: model.Content,
				},
			}, nil
		},
	}

	for _, item := range items {
		loader, ok := loaders[item.ItemType]
		if !ok {
			return nil, fmt.Errorf("unknown item type: %s", item.ItemType)
		}

		it, err := loader(item.ItemId)
		if err != nil {
			return nil, err
		}

		resume.Items[item.ItemType] = append(resume.Items[item.ItemType], *it)
	}

	return resume, nil
}
