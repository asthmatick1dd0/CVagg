package container

import (
	"log"

	"github.com/asthmatick1dd0/CVagg/internal/database"
	"github.com/asthmatick1dd0/CVagg/internal/handlers"
	"github.com/asthmatick1dd0/CVagg/internal/repository"
	"github.com/asthmatick1dd0/CVagg/internal/service"
)

// Пополнять по мере подключения новых хендлеров к рутам
type HandlerContainer struct {
	userRepo          repository.UserRepository
	resumeRepo        repository.ResumeRepository
	resumeItemRepo    repository.ItemRepository
	jobExperienceRepo repository.JobExperienceRepository
	educationRepo     repository.EducationRepository
	hardSkillRepo     repository.HardSkillRepository
	aboutRepo         repository.AboutRepository
	customRepo        repository.CustomRepository

	dashboardService service.DashboardService
	authService      service.AuthService
	editorService    service.EditorService

	DashboardHandler handlers.DashboardHandler
	AuthHandler      handlers.AuthHandler
	EditorHandler    handlers.EditorHandler
}

func NewHandlerContainer() *HandlerContainer {
	db, err := database.ConnectDB()
	if err != nil {
		log.Fatalf("failed to connect to DB: %v", err)
	}

	_userRepo := repository.NewUserRepository(db)
	_resumeRepo := repository.NewResumeRepository(db)
	_resumeItemRepo := repository.NewItemRepository(db)
	_jobExperienceRepo := repository.NewJobExperienceRepository(db)
	_educationRepo := repository.NewEducationRepository(db)
	_hardSkillRepo := repository.NewHardSkillRepository(db)
	_aboutRepo := repository.NewAboutRepository(db)
	_customRepo := repository.NewCustomRepository(db)

	log.Printf("Connected to DB successfully")

	_dashboardService := service.NewDashboardService(_resumeRepo)
	_authService := service.NewAuthService(_userRepo)
	_editorService := service.NewEditorService(
		_resumeRepo,
		_resumeItemRepo,
		_jobExperienceRepo,
		_educationRepo,
		_hardSkillRepo,
		_aboutRepo,
		_customRepo,
	)

	log.Printf("Initialized Resume Service")

	_dashboardHandler := handlers.NewDashboardHandler(_dashboardService)
	_authHandler := handlers.NewAuthHandler(_authService)
	_editorHandler := handlers.NewEditorHandler(_editorService)

	log.Printf("Initialized Resume Handler")

	container := &HandlerContainer{
		userRepo:          _userRepo,
		resumeRepo:        _resumeRepo,
		resumeItemRepo:    _resumeItemRepo,
		jobExperienceRepo: _jobExperienceRepo,
		educationRepo:     _educationRepo,
		hardSkillRepo:     _hardSkillRepo,
		aboutRepo:         _aboutRepo,
		customRepo:        _customRepo,

		dashboardService: _dashboardService,
		authService:      _authService,
		editorService:    _editorService,

		DashboardHandler: _dashboardHandler,
		AuthHandler:      _authHandler,
		EditorHandler:    _editorHandler,
	}

	log.Printf("Initialized handler container")

	return container
}
