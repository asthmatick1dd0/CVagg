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

	resumeService service.ResumeService

	resumeHandler handlers.ProfileHandler
}

func NewHandlerContainer() *HandlerContainer {
	db, err := database.ConnectDB()
	if err != nil {
		log.Fatalf("failed to connect to DB: %v", err)
	}

	_resumeRepo := repository.NewResumeRepository(db)

	log.Printf("Connected to DB successfully")

	_resumeService := service.NewResumeService(_resumeRepo)

	log.Printf("Initialized Resume Service")

	_resumeHandler := handlers.NewProfileHandler(_resumeService)

	log.Printf("Initialized Resume Handler")

	container := &HandlerContainer{
		resumeRepo:    _resumeRepo,
		resumeService: _resumeService,
		resumeHandler: _resumeHandler,
	}

	log.Printf("Initialized handler container")

	return container
}
