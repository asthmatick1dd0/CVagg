package parsing

import "encoding/json"

func QueryParser[T any](obj *T, queries map[string]string) error {
	jsonStr, err := json.Marshal(queries)
	if err != nil {
		return err
	}
	if err := json.Unmarshal(jsonStr, &obj); err != nil {
		return err
	}
	return nil
}
