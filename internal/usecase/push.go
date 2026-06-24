package usecase

import (
	"context"
	"encoding/json"
	"log/slog"
	"time"

	"arkhe/internal/domain"
	"arkhe/internal/port"

	webpush "github.com/SherClockHolmes/webpush-go"
	"github.com/google/uuid"
)

type PushUsecase struct {
	repo         port.PushRepository
	vapidPublic  string
	vapidPrivate string
	vapidSubject string
}

func NewPushUsecase(repo port.PushRepository, vapidPublic, vapidPrivate, vapidSubject string) *PushUsecase {
	return &PushUsecase{
		repo:         repo,
		vapidPublic:  vapidPublic,
		vapidPrivate: vapidPrivate,
		vapidSubject: vapidSubject,
	}
}

func (uc *PushUsecase) VAPIDPublicKey() string {
	return uc.vapidPublic
}

func (uc *PushUsecase) Subscribe(ctx context.Context, userID uuid.UUID, endpoint, p256dh, auth string) error {
	return uc.repo.Save(ctx, domain.PushSubscription{
		ID:       uuid.New(),
		UserID:   userID,
		Endpoint: endpoint,
		P256DH:   p256dh,
		Auth:     auth,
	})
}

func (uc *PushUsecase) Unsubscribe(ctx context.Context, endpoint string) error {
	return uc.repo.DeleteByEndpoint(ctx, endpoint)
}

func (uc *PushUsecase) Enabled() bool {
	return uc.vapidPublic != "" && uc.vapidPrivate != ""
}

func (uc *PushUsecase) SendReminderToAtRiskUsers(ctx context.Context) {
	subs, err := uc.repo.GetUsersWithActiveStreaks(ctx)
	if err != nil {
		slog.Error("push: failed to get at-risk users", "err", err)
		return
	}
	for _, sub := range subs {
		uc.sendTo(ctx, sub, "🔥 Стрик под угрозой!", "Не забудь залогировать активность, чтобы не потерять стрик!")
	}
	if len(subs) > 0 {
		slog.Info("push: streak reminders sent", "count", len(subs))
	}
}

func (uc *PushUsecase) sendTo(ctx context.Context, sub domain.PushSubscription, title, body string) {
	payload, _ := json.Marshal(map[string]string{"title": title, "body": body})
	s := &webpush.Subscription{
		Endpoint: sub.Endpoint,
		Keys: webpush.Keys{
			P256dh: sub.P256DH,
			Auth:   sub.Auth,
		},
	}
	resp, err := webpush.SendNotification(payload, s, &webpush.Options{
		VAPIDPublicKey:  uc.vapidPublic,
		VAPIDPrivateKey: uc.vapidPrivate,
		Subscriber:      uc.vapidSubject,
		TTL:             3600,
	})
	if err != nil {
		slog.Error("push: send failed", "err", err, "user_id", sub.UserID)
		return
	}
	defer resp.Body.Close()
	if resp.StatusCode == 410 {
		_ = uc.repo.DeleteByEndpoint(ctx, sub.Endpoint)
	}
}

func (uc *PushUsecase) StartScheduler(ctx context.Context) {
	go func() {
		for {
			now := time.Now().UTC()
			next := time.Date(now.Year(), now.Month(), now.Day(), 18, 0, 0, 0, time.UTC)
			if !now.Before(next) {
				next = next.Add(24 * time.Hour)
			}
			select {
			case <-ctx.Done():
				return
			case <-time.After(time.Until(next)):
				uc.SendReminderToAtRiskUsers(ctx)
			}
		}
	}()
}
