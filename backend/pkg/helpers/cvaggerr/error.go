// Package cvaggerr provides custom error handling
package cvaggerr

type Error interface {
	Error() string
	ErrorRussian() string
	ErrorCode() int
	Data() interface{}
	SetData(interface{})
}
