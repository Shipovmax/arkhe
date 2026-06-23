package middleware

import (
	"encoding/json"
	"io"
)

func encodeJSON(w io.Writer, v any) {
	_ = json.NewEncoder(w).Encode(v)
}
