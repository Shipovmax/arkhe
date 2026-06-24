package domain

import "github.com/google/uuid"

type PushSubscription struct {
	ID       uuid.UUID
	UserID   uuid.UUID
	Endpoint string
	P256DH   string
	Auth     string
}
