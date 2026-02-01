// Package cvagger provides custom error handling
package cvagger

type Error interface {
	Error() string
	ErrorRussian() string
	ErrorCode() int
	Data() interface{}
	SetData(interface{})
}
