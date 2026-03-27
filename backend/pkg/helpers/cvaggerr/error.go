// Package cvaggerr provides custom error handling
package cvaggerr

type Error interface {
	Error() string
	ErrorRussian() string
	ErrorCode() int
	Data() interface{}
	SetData(interface{})
}

type err struct {
	English   string
	Russian   string
	errorCode int
	data      interface{}
}

func NewD(er error) Error {
	if er == nil {
		return nil
	}
	return &err{
		English:   er.Error(),
		Russian:   er.Error(),
		errorCode: -1,
	}
}

func New(eng, rus string, code int) Error {
	return &err{
		English:   eng,
		Russian:   rus,
		errorCode: code,
	}
}

func (e *err) Error() string {
	return e.English
}

func (e *err) ErrorRussian() string {
	return e.Russian
}

func (e *err) ErrorCode() int {
	return e.errorCode
}

func (e *err) Data() interface{} {
	return e.data
}

func (e *err) SetData(data interface{}) {
	e.data = data
}

func Is(incomeError Error, targetError Error) bool {
	if incomeError.Error() != targetError.Error() {
		return false
	}
	if incomeError.ErrorRussian() != targetError.ErrorRussian() {
		return false
	}
	if incomeError.ErrorCode() != targetError.ErrorCode() {
		return false
	}
	return true
}
