package editor

import (
	"bytes"
	"fmt"
	"time"

	"github.com/asthmatick1dd0/CVagg/internal/models"
	dashboardRepo "github.com/asthmatick1dd0/CVagg/internal/modules/dashboard"
	aboutRepo "github.com/asthmatick1dd0/CVagg/internal/modules/editor/entity/about"
	customRepo "github.com/asthmatick1dd0/CVagg/internal/modules/editor/entity/custom"
	educationRepo "github.com/asthmatick1dd0/CVagg/internal/modules/editor/entity/education"
	hardSkillRepo "github.com/asthmatick1dd0/CVagg/internal/modules/editor/entity/hard_skill"
	jobExpRepo "github.com/asthmatick1dd0/CVagg/internal/modules/editor/entity/job_experience"
	personalDataRepo "github.com/asthmatick1dd0/CVagg/internal/modules/editor/entity/personal_data"
	resumeItemRepo "github.com/asthmatick1dd0/CVagg/internal/modules/editor/entity/resume_item"
	"github.com/asthmatick1dd0/CVagg/internal/modules/redis"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
	"github.com/gofiber/fiber/v2"
	"github.com/jung-kurt/gofpdf"
	"gorm.io/gorm"
)

type Service interface {
	SaveResume(tx *gorm.DB, resume *input.ResumeInput) cvaggerr.Error
	GetResumeByID(tx *gorm.DB, id uint) (*input.ResumeInput, cvaggerr.Error)
	ExportResumePDF(tx *gorm.DB, id uint) ([]byte, cvaggerr.Error)
	UpdateResume(tx *gorm.DB, resume *input.ResumeInput) cvaggerr.Error
	CheckCooldown(ctx *fiber.Ctx, userID string) (bool, cvaggerr.Error)
	SetCooldown(ctx *fiber.Ctx, userID string, duration time.Duration) cvaggerr.Error
}

type service struct {
	resumeRepo       dashboardRepo.Repository
	resumeItemRepo   resumeItemRepo.Repository
	jobExpRepo       jobExpRepo.Repository
	educationRepo    educationRepo.Repository
	hardSkillRepo    hardSkillRepo.Repository
	aboutRepo        aboutRepo.Repository
	customRepo       customRepo.Repository
	personalDataRepo personalDataRepo.Repository
	cooldownRepo     redis.Repository
}

func NewService(
	resumeRepo dashboardRepo.Repository,
	resumeItemRepo resumeItemRepo.Repository,
	jobExpRepo jobExpRepo.Repository,
	educationRepo educationRepo.Repository,
	hardSkillRepo hardSkillRepo.Repository,
	aboutRepo aboutRepo.Repository,
	customRepo customRepo.Repository,
	personalDataRepo personalDataRepo.Repository,
	cooldownRepo redis.Repository,
) Service {
	return &service{
		resumeRepo:       resumeRepo,
		resumeItemRepo:   resumeItemRepo,
		jobExpRepo:       jobExpRepo,
		educationRepo:    educationRepo,
		hardSkillRepo:    hardSkillRepo,
		aboutRepo:        aboutRepo,
		customRepo:       customRepo,
		personalDataRepo: personalDataRepo,
		cooldownRepo:     cooldownRepo,
	}
}

func (s *service) SaveResume(tx *gorm.DB, resume *input.ResumeInput) cvaggerr.Error {
	resumeInput := &models.Resume{
		Title:  resume.Title,
		UserID: resume.UserID,
	}
	if err := s.resumeRepo.Create(tx, resumeInput); err != nil {
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
				if err := s.SaveJobExperience(tx, &it, resumeInput.ID); err != nil {
					return err
				}
			}
		case "education":
			for _, it := range items {
				if err := s.SaveEducation(tx, &it, resumeInput.ID); err != nil {
					return err
				}
			}
		case "hardskill":
			for _, it := range items {
				if err := s.SaveHardSkill(tx, &it, resumeInput.ID); err != nil {
					return err
				}
			}
		case "about":
			for _, it := range items {
				if err := s.SaveAbout(tx, &it, resumeInput.ID); err != nil {
					return err
				}
			}
		case "custom":
			for _, it := range items {
				if err := s.SaveCustom(tx, &it, resumeInput.ID); err != nil {
					return err
				}
			}
		case "personal_data":
			for _, it := range items {
				if err := s.SavePersonalData(tx, &it, resumeInput.ID); err != nil {
					return err
				}
			}
		}
	}
	return nil
}

func (s *service) UpdateResume(tx *gorm.DB, resume *input.ResumeInput) cvaggerr.Error {
	resumeInput := &models.Resume{
		Title:  resume.Title,
		UserID: resume.UserID,
	}
	if err := s.resumeRepo.Update(tx, resumeInput, resume.ID); err != nil {
		return err
	}

	// Get all existing resume items to track what needs to be deleted
	existingItems, err := s.resumeItemRepo.GetAllByResumeID(tx, resume.ID, "resume_item.item")
	if err != nil {
		return err
	}

	// Track which items are still present (to identify deleted items)
	keptFieldIDs := make(map[uint]bool)

	// проходимся по мапе и обрабатываем []Items исходя из ключа
	for section, items := range resume.Items {
		// TODO [CVAGG-59] Переписать этот монструозный свитч в мапу
		switch section {
		case "jobexperience":
			// здесь проходимся по массиву Items
			// поскольку в одном резюме может быть множество, допустим, опыта работы, то у нас в каждой секции лежит массив
			for _, it := range items {
				if it.FieldID == 0 {
					// Create new item
					if err := s.SaveJobExperience(tx, &it, resume.ID); err != nil {
						return err
					}
				} else {
					// Update existing item
					keptFieldIDs[it.FieldID] = true
					if err := s.UpdateJobExperience(tx, &it, resume.ID); err != nil {
						return err
					}
				}
			}
		case "education":
			for _, it := range items {
				if it.FieldID == 0 {
					if err := s.SaveEducation(tx, &it, resume.ID); err != nil {
						return err
					}
				} else {
					keptFieldIDs[it.FieldID] = true
					if err := s.UpdateEducation(tx, &it, resume.ID); err != nil {
						return err
					}
				}
			}
		case "hardskill":
			for _, it := range items {
				if it.FieldID == 0 {
					if err := s.SaveHardSkill(tx, &it, resume.ID); err != nil {
						return err
					}
				} else {
					keptFieldIDs[it.FieldID] = true
					if err := s.UpdateHardSkill(tx, &it, resume.ID); err != nil {
						return err
					}
				}
			}
		case "about":
			for _, it := range items {
				if it.FieldID == 0 {
					if err := s.SaveAbout(tx, &it, resume.ID); err != nil {
						return err
					}
				} else {
					keptFieldIDs[it.FieldID] = true
					if err := s.UpdateAbout(tx, &it, resume.ID); err != nil {
						return err
					}
				}
			}
		case "custom":
			for _, it := range items {
				if it.FieldID == 0 {
					if err := s.SaveCustom(tx, &it, resume.ID); err != nil {
						return err
					}
				} else {
					keptFieldIDs[it.FieldID] = true
					if err := s.UpdateCustom(tx, &it, resume.ID); err != nil {
						return err
					}
				}
			}
		case "personal_data":
			for _, it := range items {
				if it.FieldID == 0 {
					if err := s.SavePersonalData(tx, &it, resume.ID); err != nil {
						return err
					}
				} else {
					keptFieldIDs[it.FieldID] = true
					if err := s.UpdatePersonalData(tx, &it, resume.ID); err != nil {
						return err
					}
				}
			}
		}
	}

	// Delete items that are no longer present
	for _, existingItem := range existingItems {
		if !keptFieldIDs[existingItem.ID] {
			// Delete the resume item and its associated data
			if err := s.DeleteResumeItem(tx, existingItem); err != nil {
				return err
			}
		}
	}

	return nil
}

func (s *service) UpdateJobExperience(tx *gorm.DB, it *input.ItemInput, ID uint) cvaggerr.Error {
	jobExpModel := &models.JobExperience{
		Company:   it.JobExperience.Company,
		Position:  it.JobExperience.Position,
		StartDate: it.JobExperience.StartDate,
		EndDate:   it.JobExperience.EndDate,
	}

	if err := s.jobExpRepo.Update(tx, jobExpModel, "resume_item.job_experiences", it.FieldID); err != nil {
		return err
	}

	return nil
}

func (s *service) UpdatePersonalData(tx *gorm.DB, it *input.ItemInput, ID uint) cvaggerr.Error {
	personalDataModel := &models.PersonalData{
		DesiredJob: it.PersonalData.DesiredJob,
		FullName:   it.PersonalData.FullName,
		Email:      it.PersonalData.Email,
		Phone:      it.PersonalData.Phone,
		Address:    it.PersonalData.Address,
	}

	if err := s.personalDataRepo.Update(tx, personalDataModel, "resume_item.personal_data", it.FieldID); err != nil {
		return err
	}

	return nil
}

func (s *service) UpdateEducation(tx *gorm.DB, it *input.ItemInput, ID uint) cvaggerr.Error {
	educationModel := &models.Education{
		University: it.Education.University,
		Faculty:    it.Education.Faculty,
		Degree:     it.Education.Degree,
		Major:      it.Education.Major,
		StartDate:  it.Education.StartDate,
		EndDate:    it.Education.EndDate,
		Finished:   it.Education.Finished,
	}

	if err := s.educationRepo.Update(tx, educationModel, "resume_item.educations", it.FieldID); err != nil {
		return err
	}

	return nil
}

func (s *service) UpdateHardSkill(tx *gorm.DB, it *input.ItemInput, ID uint) cvaggerr.Error {
	hardSkillModel := &models.HardSkill{
		SkillId: it.HardSkill.SkillID,
	}

	if err := s.hardSkillRepo.Update(tx, hardSkillModel, "resume_item.hard_skills", it.FieldID); err != nil {
		return err
	}

	return nil
}

func (s *service) UpdateAbout(tx *gorm.DB, it *input.ItemInput, ID uint) cvaggerr.Error {
	aboutModel := &models.About{
		About: it.About.About,
	}

	if err := s.aboutRepo.Update(tx, aboutModel, "resume_item.about", it.FieldID); err != nil {
		return err
	}

	return nil
}

func (s *service) UpdateCustom(tx *gorm.DB, it *input.ItemInput, ID uint) cvaggerr.Error {
	customModel := &models.Custom{
		Title:   it.Custom.Title,
		Content: it.Custom.Content,
	}

	if err := s.customRepo.Update(tx, customModel, "resume_item.custom", it.FieldID); err != nil {
		return err
	}

	return nil
}

// DeleteResumeItem deletes a resume item and its associated data
func (s *service) DeleteResumeItem(tx *gorm.DB, item *models.ResumeItem) cvaggerr.Error {
	// Delete the associated data based on item type
	switch item.ItemType {
	case "jobexperience":
		if err := s.jobExpRepo.Delete(tx, item.ItemId, "resume_item.job_experiences"); err != nil {
			return err
		}
	case "education":
		if err := s.educationRepo.Delete(tx, item.ItemId, "resume_item.educations"); err != nil {
			return err
		}
	case "hardskill":
		if err := s.hardSkillRepo.Delete(tx, item.ItemId, "resume_item.hard_skills"); err != nil {
			return err
		}
	case "about":
		if err := s.aboutRepo.Delete(tx, item.ItemId, "resume_item.about"); err != nil {
			return err
		}
	case "custom":
		if err := s.customRepo.Delete(tx, item.ItemId, "resume_item.custom"); err != nil {
			return err
		}
	case "personal_data":
		if err := s.personalDataRepo.Delete(tx, item.ItemId, "resume_item.personal_data"); err != nil {
			return err
		}
	}

	// Delete the resume item itself
	if err := s.resumeItemRepo.Delete(tx, item.ID, "resume_item.item"); err != nil {
		return err
	}

	return nil
}

// TODO [CVAGG-56] Сделать отдельную функцию SaveResumeItem чтобы много раз не повторяться

func (s *service) SaveJobExperience(tx *gorm.DB, it *input.ItemInput, ID uint) cvaggerr.Error {
	jobExpModel := &models.JobExperience{
		Company:   it.JobExperience.Company,
		Position:  it.JobExperience.Position,
		StartDate: it.JobExperience.StartDate,
		EndDate:   it.JobExperience.EndDate,
	}

	if err := s.jobExpRepo.Create(tx, jobExpModel, "resume_item.job_experiences"); err != nil {
		return err
	}

	resumeItemModel := &models.ResumeItem{
		ItemId:   jobExpModel.ID,
		ItemType: it.Type,

		ResumeId: ID,
	}
	if err := s.resumeItemRepo.Create(tx, resumeItemModel, "resume_item.item"); err != nil {
		return err
	}

	return nil
}

func (s *service) SavePersonalData(tx *gorm.DB, it *input.ItemInput, ID uint) cvaggerr.Error {
	personalDataModel := &models.PersonalData{
		DesiredJob: it.PersonalData.DesiredJob,
		FullName:   it.PersonalData.FullName,
		Email:      it.PersonalData.Email,
		Phone:      it.PersonalData.Phone,
		Address:    it.PersonalData.Address,
	}

	if err := s.personalDataRepo.Create(tx, personalDataModel, "resume_item.personal_data"); err != nil {
		return err
	}

	resumeItemModel := &models.ResumeItem{
		ItemType: it.Type,
		ItemId:   personalDataModel.ID,

		ResumeId: ID,
	}
	if err := s.resumeItemRepo.Create(tx, resumeItemModel, "resume_item.item"); err != nil {
		return err
	}

	return nil
}

func (s *service) SaveEducation(tx *gorm.DB, it *input.ItemInput, ID uint) cvaggerr.Error {
	educationModel := &models.Education{
		University: it.Education.University,
		Faculty:    it.Education.Faculty,
		Degree:     it.Education.Degree,
		Major:      it.Education.Major,
		StartDate:  it.Education.StartDate,
		EndDate:    it.Education.EndDate,
		Finished:   it.Education.Finished,
	}

	if err := s.educationRepo.Create(tx, educationModel, "resume_item.educations"); err != nil {
		return err
	}

	resumeItemModel := &models.ResumeItem{
		ItemId:   educationModel.ID,
		ItemType: it.Type,

		ResumeId: ID,
	}
	if err := s.resumeItemRepo.Create(tx, resumeItemModel, "resume_item.item"); err != nil {
		return err
	}

	return nil
}

func (s *service) SaveHardSkill(tx *gorm.DB, it *input.ItemInput, ID uint) cvaggerr.Error {
	hardSkillModel := &models.HardSkill{
		SkillId: it.HardSkill.SkillID,
	}

	if err := s.hardSkillRepo.Create(tx, hardSkillModel, "resume_item.hard_skills"); err != nil {
		return err
	}

	resumeItemModel := &models.ResumeItem{
		ItemType: it.Type,
		ItemId:   hardSkillModel.ID,

		ResumeId: ID,
	}
	if err := s.resumeItemRepo.Create(tx, resumeItemModel, "resume_item.item"); err != nil {
		return err
	}

	return nil
}

func (s *service) SaveAbout(tx *gorm.DB, it *input.ItemInput, ID uint) cvaggerr.Error {
	aboutModel := &models.About{
		About: it.About.About,
	}

	if err := s.aboutRepo.Create(tx, aboutModel, "resume_item.about"); err != nil {
		return err
	}

	resumeItemInput := &models.ResumeItem{
		ItemType: it.Type,
		ItemId:   aboutModel.ID,

		ResumeId: ID,
	}
	if err := s.resumeItemRepo.Create(tx, resumeItemInput, "resume_item.item"); err != nil {
		return err
	}

	return nil
}

func (s *service) SaveCustom(tx *gorm.DB, it *input.ItemInput, ID uint) cvaggerr.Error {
	customModel := &models.Custom{
		Title:   it.Custom.Title,
		Content: it.Custom.Content,
	}

	if err := s.customRepo.Create(tx, customModel, "resume_item.custom"); err != nil {
		return err
	}

	resumeItemModel := &models.ResumeItem{
		ItemType: it.Type,
		ItemId:   customModel.ID,

		ResumeId: ID,
	}
	if err := s.resumeItemRepo.Create(tx, resumeItemModel, "resume_item.item"); err != nil {
		return err
	}

	return nil
}

func (s *service) GetResumeByID(tx *gorm.DB, id uint) (*input.ResumeInput, cvaggerr.Error) {
	resumeModel, err := s.resumeRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	resume := &input.ResumeInput{
		ID:     resumeModel.ID,
		UserID: resumeModel.UserID,
		Title:  resumeModel.Title,
		Items:  make(map[string][]input.ItemInput),
	}

	items, err := s.resumeItemRepo.GetAllByResumeID(tx, id, "resume_item.item")
	if err != nil {
		return nil, err
	}

	loaders := map[string]func(itemID uint) (*input.ItemInput, error){
		"jobexperience": func(itemID uint) (*input.ItemInput, error) {
			model, err := s.jobExpRepo.GetByID(tx, itemID, "resume_item.job_experiences")
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
			model, err := s.educationRepo.GetByID(tx, itemID, "resume_item.educations")
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
			model, err := s.hardSkillRepo.GetByID(tx, itemID, "resume_item.hard_skills")
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
			model, err := s.aboutRepo.GetByID(tx, itemID, "resume_item.about")
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
			model, err := s.customRepo.GetByID(tx, itemID, "resume_item.custom")
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

		"personal_data": func(itemID uint) (*input.ItemInput, error) {
			model, err := s.personalDataRepo.GetByID(tx, itemID, "resume_item.personal_data")
			if err != nil {
				return nil, err
			}

			return &input.ItemInput{
				Type:     "personal_data",
				FieldID:  model.ID,
				ResumeID: id,
				PersonalData: &input.PersonalDataInput{
					DesiredJob: model.DesiredJob,
					FullName:   model.FullName,
					Email:      model.Email,
					Phone:      model.Phone,
					Address:    model.Address,
				},
			}, nil
		},
	}

	for _, item := range items {
		loader, ok := loaders[item.ItemType]
		if !ok {
			return nil, cvaggerr.ErrorDataBase()
		}

		it, err := loader(item.ItemId)
		if err != nil {
			return nil, cvaggerr.ErrorDataBase()
		}

		resume.Items[item.ItemType] = append(resume.Items[item.ItemType], *it)
	}

	return resume, nil
}

func (s *service) ExportResumePDF(tx *gorm.DB, id uint) ([]byte, cvaggerr.Error) {
	resume, err := s.GetResumeByID(tx, id)
	if err != nil {
		return nil, err
	}

	pdf := gofpdf.New("P", "mm", "A4", "")

	fontPath := "assets/fonts/DejaVuSans.ttf"
	pdf.AddUTF8Font("DejaVu", "", fontPath)
	pdf.SetFont("DejaVu", "", 14)
	pdf.AddPage()

	marginX := 20.0

	// Title
	pdf.SetXY(marginX, 20)
	pdf.SetFont("DejaVu", "", 16)
	pdf.CellFormat(0, 8, resume.Title, "", 1, "L", false, 0, "")
	pdf.Ln(2)
	pdf.SetFont("DejaVu", "", 12)

	// Personal data
	if items, ok := resume.Items["personal_data"]; ok && len(items) > 0 {
		pd := items[0].PersonalData
		pdf.SetX(marginX)
		pdf.CellFormat(0, 6, pd.FullName, "", 1, "L", false, 0, "")
		contact := pd.Email
		if pd.Phone != "" {
			if contact != "" {
				contact += " | "
			}
			contact += pd.Phone
		}
		if contact != "" {
			pdf.SetX(marginX)
			pdf.CellFormat(0, 6, contact, "", 1, "L", false, 0, "")
		}
		if pd.Address != "" {
			pdf.SetX(marginX)
			pdf.CellFormat(0, 6, pd.Address, "", 1, "L", false, 0, "")
		}
		if pd.DesiredJob != "" {
			pdf.SetX(marginX)
			pdf.CellFormat(0, 6, pd.DesiredJob, "", 1, "L", false, 0, "")
		}
		pdf.Ln(2)
	}

	// Job experience
	if items, ok := resume.Items["jobexperience"]; ok && len(items) > 0 {
		pdf.SetFont("DejaVu", "", 12)
		pdf.SetX(marginX)
		pdf.CellFormat(0, 7, "Experience:", "", 1, "L", false, 0, "")
		for _, it := range items {
			je := it.JobExperience
			line := fmt.Sprintf("%s — %s (%s - %s)", je.Company, je.Position, je.StartDate, je.EndDate)
			pdf.SetX(marginX + 4)
			pdf.MultiCell(0, 6, line, "", "L", false)
		}
		pdf.Ln(2)
	}

	// Education
	if items, ok := resume.Items["education"]; ok && len(items) > 0 {
		pdf.SetX(marginX)
		pdf.CellFormat(0, 7, "Education:", "", 1, "L", false, 0, "")
		for _, it := range items {
			ed := it.Education
			line := fmt.Sprintf("%s — %s, %s (%s - %s)", ed.University, ed.Degree, ed.Major, ed.StartDate, ed.EndDate)
			pdf.SetX(marginX + 4)
			pdf.MultiCell(0, 6, line, "", "L", false)
		}
		pdf.Ln(2)
	}

	// Hard skills
	if items, ok := resume.Items["hardskill"]; ok && len(items) > 0 {
		pdf.SetX(marginX)
		pdf.CellFormat(0, 7, "Skills:", "", 1, "L", false, 0, "")
		skills := ""
		for i, it := range items {
			if i > 0 {
				skills += ", "
			}
			skills += fmt.Sprintf("%d", it.HardSkill.SkillID)
		}
		pdf.SetX(marginX + 4)
		pdf.MultiCell(0, 6, skills, "", "L", false)
		pdf.Ln(2)
	}

	// About
	if items, ok := resume.Items["about"]; ok && len(items) > 0 {
		pdf.SetX(marginX)
		pdf.CellFormat(0, 7, "About:", "", 1, "L", false, 0, "")
		for _, it := range items {
			pdf.SetX(marginX + 4)
			pdf.MultiCell(0, 6, it.About.About, "", "L", false)
		}
		pdf.Ln(2)
	}

	// Custom sections
	if items, ok := resume.Items["custom"]; ok && len(items) > 0 {
		for _, it := range items {
			pdf.SetX(marginX)
			pdf.CellFormat(0, 7, it.Custom.Title, "", 1, "L", false, 0, "")
			pdf.SetX(marginX + 4)
			pdf.MultiCell(0, 6, it.Custom.Content, "", "L", false)
			pdf.Ln(1)
		}
	}

	var buf bytes.Buffer
	if err := pdf.Output(&buf); err != nil {
		return nil, cvaggerr.New(err.Error(), err.Error(), 500)
	}
	return buf.Bytes(), nil
}

func (s *service) CheckCooldown(ctx *fiber.Ctx, userID string) (bool, cvaggerr.Error) {
	if userID == "" {
		return false, cvaggerr.ErrorWrongID()
	}

	cooldown, err := s.cooldownRepo.IsOnCooldown(ctx, userID)
	if err != nil {
		return false, err
	}

	return cooldown, nil
}

func (s *service) SetCooldown(ctx *fiber.Ctx, userID string, duration time.Duration) cvaggerr.Error {
	if userID == "" {
		return cvaggerr.ErrorWrongID()
	}

	err := s.cooldownRepo.SetCooldown(ctx, userID, duration)
	if err != nil {
		return err
	}

	return nil
}
