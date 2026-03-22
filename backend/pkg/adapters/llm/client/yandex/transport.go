package yandex

import "net/http"

type yandexTransport struct {
	wrapped  http.RoundTripper
	folderID string
}

func (t *yandexTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	req.Header.Set("x-folder-id", t.folderID)
	return t.wrapped.RoundTrip(req)
}
