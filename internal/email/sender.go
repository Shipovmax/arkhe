package email

import (
	"context"
	"fmt"

	"github.com/resend/resend-go/v2"
)

// Sender wraps the Resend client for sending transactional emails.
type Sender struct {
	client *resend.Client
	from   string
}

// NewSender creates a new Sender. Returns nil if apiKey is empty (email disabled).
func NewSender(apiKey, from string) *Sender {
	if apiKey == "" {
		return nil
	}
	return &Sender{
		client: resend.NewClient(apiKey),
		from:   from,
	}
}

// Send sends an email. Errors are logged by the caller.
func (s *Sender) Send(ctx context.Context, to, subject, htmlBody string) error {
	if s == nil {
		return nil
	}
	params := &resend.SendEmailRequest{
		From:    s.from,
		To:      []string{to},
		Subject: subject,
		Html:    htmlBody,
	}
	_, err := s.client.Emails.Send(params)
	if err != nil {
		return fmt.Errorf("resend: %w", err)
	}
	return nil
}
