package resp

import (
	"net/http"

	"github.com/asthmatick1dd0/CVagg/pkg/helpers/cvaggerr"
	"github.com/gofiber/fiber/v2"
)

type response struct {
	Code      int         `json:"code"`
	Message   string      `json:"message"`
	Data      interface{} `json:"data"`
	Paginator *paginator  `json:"paginator,omitempty"`
}

type paginator struct {
	Total    int `json:"total"`
	PagesNum int `json:"pages_num"`
	Page     int `json:"page"`
	Offset   int `json:"offset"`
	Limit    int `json:"limit"`
}

func HandleSuccess(c *fiber.Ctx, data interface{}, paginator ...*paginator) error {
	var resp response
	if data == nil {
		data = map[string]string{}
	}
	if len(paginator) > 0 {
		resp = response{Code: http.StatusOK, Message: "success", Data: data, Paginator: paginator[0]}
	} else {
		resp = response{Code: http.StatusOK, Message: "success", Data: data}
	}
	return c.Status(http.StatusOK).JSON(resp)
}

func HandleError(c *fiber.Ctx, err cvaggerr.Error) error {
	if err.Data() == nil {
		err.SetData(map[string]string{})
	}
	resp := response{Code: err.ErrorCode(), Message: err.ErrorRussian(), Data: err.Data()}
	return c.Status(err.ErrorCode()).JSON(resp)
}

func HandleUserError(c *fiber.Ctx, err cvaggerr.Error) error {
	resp := response{Code: http.StatusOK, Message: err.ErrorRussian(), Data: err.Data()}
	return c.Status(http.StatusOK).JSON(resp)
}

func NewPaginator(total int, page int, limit int) *paginator {
	var pagesNum int
	if total%limit == 0 {
		pagesNum = total / limit
	} else {
		pagesNum = total/limit + 1
	}
	return &paginator{
		Total:    total,
		PagesNum: pagesNum,
		Page:     page,
		Offset:   (page - 1) * limit,
		Limit:    limit,
	}
}
