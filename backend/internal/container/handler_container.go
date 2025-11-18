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
	resumeRepo repository.ResumeRepository
	authRepo   repository.UserRepository

	resumeService service.ResumeService
	authService   service.AuthService
	editorService service.EditorService

	ResumeHandler handlers.ProfileHandler
	AuthHandler   handlers.AuthHandler
	EditorHandler handlers.EditorHandler
}

func NewHandlerContainer() *HandlerContainer {
	db, err := database.ConnectDB()
	if err != nil {
		log.Fatalf("failed to connect to DB: %v", err)
	}

	_resumeRepo := repository.NewResumeRepository(db)
	_authRepo := repository.NewUserRepository(db)

	log.Printf("Connected to DB successfully")

	_resumeService := service.NewResumeService(_resumeRepo)
	_authService := service.NewAuthService(_authService)
	_editorService := service.NewEditorService(_resumeRepo)

	log.Printf("Initialized Resume Service")

	_resumeHandler := handlers.NewProfileHandler(_resumeService)
	_authHandler := handlers.NewAuthHandler(_resumeService)
	_editorHandler := handlers.NewEditorHandler(_editorService)

	log.Printf("Initialized Resume Handler")

	container := &HandlerContainer{
		resumeRepo: _resumeRepo,
		authRepo:   _authRepo,

		resumeService: _resumeService,
		authService:   _authService,
		editorService: _editorService,

		ResumeHandler: _resumeHandler,
		AuthHandler:   _authHandler,
		EditorHandler: _editorHandler,
	}

	log.Printf("Initialized handler container")

	return container
}
