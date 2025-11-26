package tests

import (
	"errors"
	"testing"
	"time"

	"github.com/asthmatick1dd0/CVagg/internal/models"
	"github.com/asthmatick1dd0/CVagg/internal/service"
	"github.com/asthmatick1dd0/CVagg/internal/transport/input"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// ======== UTILS ========
func timePtr(t time.Time) *time.Time { return &t }

// ======== MOCKS ========

type MockResumeRepo struct{ mock.Mock }

func (m *MockResumeRepo) Create(r *models.Resume) error                   { return m.Called(r).Error(0) }
func (m *MockResumeRepo) GetById(id uint) (*models.Resume, error)        { args := m.Called(id); return args.Get(0).(*models.Resume), args.Error(1) }
func (m *MockResumeRepo) GetByUserId(userID uint) ([]models.Resume, error) { args := m.Called(userID); return args.Get(0).([]models.Resume), args.Error(1) }
func (m *MockResumeRepo) Update(r *models.Resume) error                   { return m.Called(r).Error(0) }
func (m *MockResumeRepo) Delete(id uint) error                            { return m.Called(id).Error(0) }
func (m *MockResumeRepo) GetAllByUserID(userID uint) ([]*models.Resume, error) {
	args := m.Called(userID)
	return args.Get(0).([]*models.Resume), args.Error(1)
}

// --- ItemRepository ---
type MockItemRepo struct{ mock.Mock }

func (m *MockItemRepo) Create(i *models.ResumeItem) error                   { return m.Called(i).Error(0) }
func (m *MockItemRepo) Delete(id uint) error                                 { return m.Called(id).Error(0) }
func (m *MockItemRepo) Update(i *models.ResumeItem) error                    { return m.Called(i).Error(0) }
func (m *MockItemRepo) GetById(id uint) (*models.ResumeItem, error)          { args := m.Called(id); return args.Get(0).(*models.ResumeItem), args.Error(1) }
func (m *MockItemRepo) GetAllByResumeID(resumeID uint) ([]*models.ResumeItem, error) {
	args := m.Called(resumeID)
	return args.Get(0).([]*models.ResumeItem), args.Error(1)
}

// --- JobExperienceRepository ---
type MockJobExpRepo struct{ mock.Mock }

func (m *MockJobExpRepo) Create(j *models.JobExperience) error {
	if j != nil {
		j.ID = 10
	}
	return m.Called(j).Error(0)
}
func (m *MockJobExpRepo) Delete(id uint) error                              { return m.Called(id).Error(0) }
func (m *MockJobExpRepo) Update(j *models.JobExperience) error             { return m.Called(j).Error(0) }
func (m *MockJobExpRepo) GetById(id uint) (*models.JobExperience, error)   { args := m.Called(id); return args.Get(0).(*models.JobExperience), args.Error(1) }
func (m *MockJobExpRepo) GetAllByResumeID(resumeID uint) ([]*models.JobExperience, error) {
	args := m.Called(resumeID)
	return args.Get(0).([]*models.JobExperience), args.Error(1)
}

// --- EducationRepository ---
type MockEducationRepo struct{ mock.Mock }

func (m *MockEducationRepo) Create(e *models.Education) error {
	if e != nil {
		e.ID = 20
	}
	return m.Called(e).Error(0)
}
func (m *MockEducationRepo) Delete(id uint) error                           { return m.Called(id).Error(0) }
func (m *MockEducationRepo) Update(e *models.Education) error              { return m.Called(e).Error(0) }
func (m *MockEducationRepo) GetById(id uint) (*models.Education, error)    { args := m.Called(id); return args.Get(0).(*models.Education), args.Error(1) }
func (m *MockEducationRepo) GetAllByResumeID(resumeID uint) ([]*models.Education, error) {
	args := m.Called(resumeID)
	return args.Get(0).([]*models.Education), args.Error(1)
}

// --- HardSkillRepository ---
type MockHardSkillRepo struct{ mock.Mock }

func (m *MockHardSkillRepo) Create(h *models.HardSkill) error {
	if h != nil {
		h.ID = 30
	}
	return m.Called(h).Error(0)
}
func (m *MockHardSkillRepo) Delete(id uint) error                           { return m.Called(id).Error(0) }
func (m *MockHardSkillRepo) Update(h *models.HardSkill) error              { return m.Called(h).Error(0) }
func (m *MockHardSkillRepo) GetById(id uint) (*models.HardSkill, error)    { args := m.Called(id); return args.Get(0).(*models.HardSkill), args.Error(1) }
func (m *MockHardSkillRepo) GetAllByResumeID(resumeID uint) ([]*models.HardSkill, error) {
	args := m.Called(resumeID)
	return args.Get(0).([]*models.HardSkill), args.Error(1)
}

// --- AboutRepository ---
type MockAboutRepo struct{ mock.Mock }

func (m *MockAboutRepo) Create(a *models.About) error {
	if a != nil {
		a.ID = 40
	}
	return m.Called(a).Error(0)
}
func (m *MockAboutRepo) Delete(id uint) error                                { return m.Called(id).Error(0) }
func (m *MockAboutRepo) Update(a *models.About) error                        { return m.Called(a).Error(0) }
func (m *MockAboutRepo) GetById(id uint) (*models.About, error)             { args := m.Called(id); return args.Get(0).(*models.About), args.Error(1) }
func (m *MockAboutRepo) GetAllByResumeID(resumeID uint) ([]*models.About, error) {
	args := m.Called(resumeID)
	return args.Get(0).([]*models.About), args.Error(1)
}

// --- CustomRepository ---
type MockCustomRepo struct{ mock.Mock }

func (m *MockCustomRepo) Create(c *models.Custom) error {
	if c != nil {
		c.ID = 50
	}
	return m.Called(c).Error(0)
}
func (m *MockCustomRepo) Delete(id uint) error                               { return m.Called(id).Error(0) }
func (m *MockCustomRepo) Update(c *models.Custom) error                      { return m.Called(c).Error(0) }
func (m *MockCustomRepo) GetById(id uint) (*models.Custom, error)           { args := m.Called(id); return args.Get(0).(*models.Custom), args.Error(1) }
func (m *MockCustomRepo) GetAllByResumeID(resumeID uint) ([]*models.Custom, error) {
	args := m.Called(resumeID)
	return args.Get(0).([]*models.Custom), args.Error(1)
}

// ======== TEST ========

func TestEditorService_SaveResume(t *testing.T) {
	startJob := uint(20250101)
    endJob := uint(20251001)

    startEdu := time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC)
    endEdu := timePtr(time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC))

    testInput := &input.ResumeInput{
      Title:  "Test Resume",
      UserID: 1,
      Items: map[string][]input.ItemInput{
        "jobexperience": {{
            Type: "job",
            JobExperience: &input.JobExperienceInput{
                Company:   "Company A",
                Position:  "Dev",
                StartDate: startJob, // uint
                EndDate:   endJob,   // uint
            },
        }},
        "education": {{
            Type: "edu",
            Education: &input.EducationInput{
                University: "Uni B",
                StartDate:  startEdu, // time.Time
                EndDate:    endEdu,   // *time.Time
                Finished:   true,
				},
			}},
			"hardskill": {{
				Type:      "skill",
				HardSkill: &input.HardSkillInput{SkillID: 3},
			}},
			"about": {{
				Type:  "about",
				About: &input.AboutInput{About: "About me"},
			}},
			"custom": {{
				Type:   "custom",
				Custom: &input.CustomInput{Title: "Custom C", Content: "Some text"},
			}},
		},
	}

	t.Run("success", func(t *testing.T) {
		resumeRepo := new(MockResumeRepo)
		itemRepo := new(MockItemRepo)
		jobRepo := new(MockJobExpRepo)
		eduRepo := new(MockEducationRepo)
		skillRepo := new(MockHardSkillRepo)
		aboutRepo := new(MockAboutRepo)
		customRepo := new(MockCustomRepo)

		resumeRepo.On("Create", mock.Anything).Return(nil)
		jobRepo.On("Create", mock.Anything).Return(nil)
		eduRepo.On("Create", mock.Anything).Return(nil)
		skillRepo.On("Create", mock.Anything).Return(nil)
		aboutRepo.On("Create", mock.Anything).Return(nil)
		customRepo.On("Create", mock.Anything).Return(nil)
		itemRepo.On("Create", mock.Anything).Return(nil)

		svc := service.NewEditorService(
			resumeRepo,
			itemRepo,
			jobRepo,
			eduRepo,
			skillRepo,
			aboutRepo,
			customRepo,
		)

		err := svc.SaveResume(testInput)
		assert.NoError(t, err)
	})

	t.Run("resume create error", func(t *testing.T) {
		resumeRepo := new(MockResumeRepo)
		resumeRepo.On("Create", mock.Anything).Return(errors.New("db error"))

		svc := service.NewEditorService(resumeRepo, nil, nil, nil, nil, nil, nil)
		err := svc.SaveResume(testInput)

		assert.Error(t, err)
		assert.EqualError(t, err, "db error")
	})
}
