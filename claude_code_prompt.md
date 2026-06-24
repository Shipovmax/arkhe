# Claude Code Prompt — Arkhe (Gamification SaaS)

## Project Overview

Build a production-ready web application called **Arkhe** — a gamification platform that turns real-life activities into RPG progression. Users log activities (gym, reading, studying), earn XP, level up stats, and track long-term growth through a character-building interface.

---

## Tech Stack (Non-Negotiable)

**Backend:** Go 1.23+
- `net/http` standard library for routing (no Gin/Echo)
- `pgx/v5` for PostgreSQL
- `golang-jwt/jwt/v5` for auth
- `golang.org/x/crypto` for bcrypt
- `golang.org/x/time/rate` for rate limiting
- `google/uuid` for UUIDs
- `github.com/resend/resend-go/v2` for email

**Database:** PostgreSQL 16

**Frontend:** Pure HTML + CSS + Vanilla JS (no React/Vue)

**Containerization:** Docker + docker-compose

**Config:** plain `os.Getenv` — no viper, no cleanenv

---

## Architecture

Clean Architecture, strict layer separation:

```
arkhe/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── domain/
│   │   ├── user.go
│   │   ├── character.go
│   │   ├── stat.go
│   │   ├── activity.go
│   │   ├── streak.go
│   │   ├── achievement.go
│   │   └── errors.go
│   ├── usecase/
│   │   ├── auth.go
│   │   ├── character.go
│   │   ├── activity.go
│   │   ├── stat.go
│   │   ├── streak.go
│   │   └── achievement.go
│   ├── port/
│   │   ├── user_repository.go
│   │   ├── character_repository.go
│   │   ├── activity_repository.go
│   │   ├── stat_repository.go
│   │   ├── streak_repository.go
│   │   └── achievement_repository.go
│   ├── adapter/
│   │   ├── postgres/
│   │   │   ├── user_repo.go
│   │   │   ├── character_repo.go
│   │   │   ├── activity_repo.go
│   │   │   ├── stat_repo.go
│   │   │   ├── streak_repo.go
│   │   │   └── achievement_repo.go
│   │   └── http/
│   │       ├── router.go
│   │       ├── middleware/
│   │       │   ├── auth.go
│   │       │   ├── cors.go
│   │       │   ├── logger.go
│   │       │   └── ratelimit.go
│   │       └── handler/
│   │           ├── auth.go
│   │           ├── character.go
│   │           ├── activity.go
│   │           ├── stat.go
│   │           └── analytics.go
│   ├── email/
│   │   ├── sender.go            # Resend client wrapper
│   │   └── templates/
│   │       ├── welcome.html
│   │       ├── streak_dying.html
│   │       └── weekly_report.html
│   └── infrastructure/
│       ├── postgres.go
│       └── config.go
├── migrations/
│   ├── 001_create_users.sql
│   ├── 002_create_characters.sql
│   ├── 003_create_stats.sql
│   ├── 004_create_activities.sql
│   ├── 005_create_streaks.sql
│   ├── 006_create_achievements.sql
│   └── 007_create_subscriptions.sql
├── web/
│   ├── index.html               # Landing page
│   ├── app.html                 # Auth gate → onboarding → dashboard SPA
│   └── assets/
│       ├── style.css
│       └── app.js
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── Makefile

---

## Database Schema (Full — Including Future Features)

Write all migrations upfront. Schema must be complete even for billing (behind feature flag).

### 001 — users
```sql
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 002 — characters
```sql
CREATE TYPE character_class AS ENUM ('student', 'worker', 'schoolkid');

CREATE TABLE characters (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    class        character_class NOT NULL,
    level        INT NOT NULL DEFAULT 1,
    total_xp     BIGINT NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);
```

### 003 — stats
```sql
CREATE TABLE stats (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id    UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    icon            TEXT NOT NULL DEFAULT '⚡',
    frequency_days  INT NOT NULL DEFAULT 1,   -- user goal: log at least once every N days
    stat_xp         BIGINT NOT NULL DEFAULT 0,
    stat_level      INT NOT NULL DEFAULT 1,
    stat_streak     INT NOT NULL DEFAULT 0,   -- consecutive frequency periods met
    longest_streak  INT NOT NULL DEFAULT 0,
    last_period_end DATE,                     -- end of the last completed period window
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(character_id, name)
);
```

### 004 — activities
```sql
CREATE TABLE activities (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    stat_id      UUID NOT NULL REFERENCES stats(id),
    description  TEXT NOT NULL,
    xp_earned    INT NOT NULL,
    logged_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activities_character_logged ON activities(character_id, logged_at DESC);
```

### 005 — streaks (global, for achievements and email workers)
```sql
CREATE TABLE streaks (
    user_id          UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current          INT NOT NULL DEFAULT 0,
    longest          INT NOT NULL DEFAULT 0,
    last_active_date DATE
);
```

Per-stat streaks are stored directly in the `stats` table (`stat_streak`, `longest_streak`, `last_period_end`).

### 006 — achievements
```sql
CREATE TABLE achievements (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        TEXT UNIQUE NOT NULL,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    icon        TEXT NOT NULL
);

CREATE TABLE user_achievements (
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id),
    unlocked_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(user_id, achievement_id)
);

-- Seed achievements inline in this migration:
INSERT INTO achievements (id, code, title, description, icon) VALUES
  (gen_random_uuid(), 'first_blood',  'First Blood',  'Залогировал первую активность', '🩸'),
  (gen_random_uuid(), 'on_fire',      'On Fire',      'Streak 7 дней подряд',         '🔥'),
  (gen_random_uuid(), 'centurion',    'Centurion',    '100 активностей залогировано',  '⚔️'),
  (gen_random_uuid(), 'level_10',     'Level X',      'Достиг 10 уровня',             '✨'),
  (gen_random_uuid(), 'bookworm',     'Bookworm',     '20 активностей в стате Reading','📚');
```

### 007 — subscriptions (billing behind feature flag)
```sql
CREATE TYPE subscription_tier AS ENUM ('free', 'pro');

CREATE TABLE subscriptions (
    user_id            UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    tier               subscription_tier NOT NULL DEFAULT 'free',
    provider           TEXT,                    -- 'stripe' | 'yookassa'
    provider_sub_id    TEXT UNIQUE,
    current_period_end TIMESTAMPTZ,
    status             TEXT NOT NULL DEFAULT 'active',
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id),
    amount_kopecks      INT NOT NULL,
    currency            TEXT NOT NULL DEFAULT 'RUB',
    provider            TEXT NOT NULL,
    provider_payment_id TEXT UNIQUE NOT NULL,
    status              TEXT NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Feature Flags

```go
// infrastructure/config.go
type Config struct {
    // ...
    BillingEnabled bool // BILLING_ENABLED=false by default
    EmailEnabled   bool // EMAIL_ENABLED=false by default
}
```

All billing handlers and email workers check these flags before executing. Schema is written in full — only runtime execution is gated.

---

## XP & Progression System

### Level formula (shared by stats and character)

```go
// domain/character.go

// XPRequired returns cumulative XP needed to reach the given level.
// Formula: 100 * level^1.5
func XPRequired(level int) int64 {
    return int64(100 * math.Pow(float64(level), 1.5))
}

// LevelFromXP derives current level from accumulated XP.
func LevelFromXP(totalXP int64) int {
    level := 1
    for XPRequired(level+1) <= totalXP {
        level++
    }
    return level
}

// XPToNextLevel returns XP remaining until the next level.
func XPToNextLevel(totalXP int64) int64 {
    current := LevelFromXP(totalXP)
    return XPRequired(current+1) - totalXP
}
```

### Per-stat XP (calculated server-side — no client slider)

```go
// usecase/activity.go

// CalcXP returns XP earned for a single activity log.
// base = 100, modified by per-stat streak and frequency adherence.
func CalcXP(statStreak int, loggedInFirstHalf bool) int {
    base := 100.0

    var streakMult float64
    switch {
    case statStreak >= 14:
        streakMult = 2.0
    case statStreak >= 7:
        streakMult = 1.5
    case statStreak >= 3:
        streakMult = 1.25
    default:
        streakMult = 1.0
    }

    freqBonus := 1.0
    if loggedInFirstHalf {
        freqBonus = 1.1
    }

    return int(math.Round(base * streakMult * freqBonus))
}
```

**`loggedInFirstHalf`** — true if the log happens in the first half of the frequency window.
Example: `frequency_days = 2`, logged on day 1 of 2 → `loggedInFirstHalf = true` → 1.1x bonus.

### Per-stat streak logic

Triggered on every `POST /api/v1/activities`, evaluated per stat:

```go
// usecase/streak.go (stat streak)
func (u *StatStreakUsecase) Update(ctx context.Context, stat *domain.Stat) error {
    today := time.Now().UTC().Truncate(24 * time.Hour)
    periodEnd := stat.LastPeriodEnd // nil on first log

    // First log ever for this stat
    if periodEnd == nil {
        stat.LastPeriodEnd = today.AddDate(0, 0, stat.FrequencyDays)
        stat.StatStreak = 1
        stat.LongestStreak = 1
        return u.repo.UpdateStreak(ctx, stat)
    }

    switch {
    case today.Before(*periodEnd):
        // Already logged this period — no streak change, still counts XP
        return nil
    case today.Equal(*periodEnd) || today.Before(periodEnd.AddDate(0, 0, stat.FrequencyDays)):
        // Logged within next valid window — streak continues
        stat.StatStreak++
    default:
        // Missed at least one full period — reset
        stat.StatStreak = 1
        // notification triggered here
    }

    if stat.StatStreak > stat.LongestStreak {
        stat.LongestStreak = stat.StatStreak
    }
    stat.LastPeriodEnd = periodEnd.AddDate(0, 0, stat.FrequencyDays)
    return u.repo.UpdateStreak(ctx, stat)
}
```

On streak reset: trigger email/push notification (respects `EMAIL_ENABLED` flag).

### Stat level

After XP is added to `stat.StatXP`, recalculate:
```go
stat.StatLevel = LevelFromXP(stat.StatXP)
```

### Character level

```go
// domain/character.go

// LevelFromStats derives character level as floor of average stat level.
// New stats start at level 1, pulling the average down — intentional tradeoff.
func LevelFromStats(statLevels []int) int {
    if len(statLevels) == 0 {
        return 1
    }
    sum := 0
    for _, l := range statLevels {
        sum += l
    }
    return sum / len(statLevels)
}
```

`characters.level` and `characters.total_xp` are **derived caches** — recalculated and written on every activity log:
- `total_xp = SUM(stat.stat_xp)` across all character stats
- `level = LevelFromStats(all stat levels)`

### XP bar on dashboard

```
fill = (total_xp - XPRequired(level)) / (XPRequired(level+1) - XPRequired(level))
```

Each stat card also shows its own mini XP bar using the same formula with `stat_xp` and `stat_level`.

---

## Global Streak Logic

Global streak (in `streaks` table) tracks whether user logged **anything** today. Used for achievements and email workers only — not for XP calculation (XP uses per-stat streak instead).

Triggered on every `POST /api/v1/activities`, after XP is written:

```go
// usecase/streak.go (global)
func (u *StreakUsecase) Update(ctx context.Context, userID uuid.UUID) error {
    streak, err := u.repo.Get(ctx, userID)
    // ...
    today := time.Now().UTC().Truncate(24 * time.Hour)
    switch {
    case streak.LastActiveDate == today:
        return nil
    case streak.LastActiveDate == today.AddDate(0, 0, -1):
        streak.Current++
    default:
        streak.Current = 1
    }
    if streak.Current > streak.Longest {
        streak.Longest = streak.Current
    }
    streak.LastActiveDate = today
    return u.repo.Upsert(ctx, streak)
}
```

---

## Achievement Check

Triggered **asynchronously** (goroutine) after each activity log. Never blocks the HTTP response.

```go
// After writing activity in handler:
go u.achievementUsecase.Check(context.Background(), characterID, userID)
```

`Check` evaluates all unearned achievements against current state. On unlock: write to `user_achievements`, send toast payload via SSE or return in next polling request.

Achievement conditions:
- `first_blood`: `COUNT(activities) >= 1`
- `on_fire`: `streaks.current >= 7`
- `centurion`: `COUNT(activities) >= 100`
- `level_10`: `characters.level >= 10`
- `bookworm`: `COUNT(activities WHERE stat = Reading) >= 20`

---

## Email (Resend)

Only fires when `EMAIL_ENABLED=true`.

```go
// email/sender.go
type Sender struct {
    client *resend.Client
    from   string // "Arkhe <noreply@arkhe.app>"
}
```

Three triggers:

**Welcome** — on `POST /auth/register`, fire-and-forget goroutine.

**Streak Dying** — background worker, runs every hour via `time.Ticker`. Checks `streaks` where `last_active_date = yesterday` AND `current >= 3`. Sends once per day max (track in Redis or a `streak_notifications` table).

**Weekly Report** — background worker, runs every Monday 10:00 UTC. Pulls: XP gained last 7 days, level change, top stat. Sends to all users with `current >= 1` streak or any activity in the past 7 days.

Workers start in `main.go` as goroutines, respect `context.Context` for graceful shutdown.

---

## API Specification

### Auth
```
POST /api/v1/auth/register   { email, password, display_name, class }
POST /api/v1/auth/login      { email, password } → { token, character }
```

### Character
```
GET  /api/v1/character       → { id, display_name, class, level, total_xp, xp_to_next, streak }
PUT  /api/v1/character       { display_name }
```

### Stats
```
GET    /api/v1/stats         → []stat  (includes stat_xp, stat_level, stat_streak, frequency_days)
POST   /api/v1/stats         { name, icon, frequency_days } → stat
PATCH  /api/v1/stats/:id     { frequency_days } → stat   (update frequency goal only)
DELETE /api/v1/stats/:id
```

### Activities
```
POST /api/v1/activities      { stat_id, description }
     → {
         activity,
         xp_earned,          -- calculated server-side
         stat_xp,            -- new stat total XP
         stat_level,         -- new stat level (may have leveled up)
         stat_level_up: bool,
         character_level,    -- new character level
         character_level_up: bool,
         stat_streak,        -- updated per-stat streak
         global_streak,
         achievements_unlocked: []
       }
GET  /api/v1/activities      ?limit=20&offset=0 → []activity
```

### Analytics
```
GET /api/v1/analytics/xp-history    ?days=30 → []{date, xp}
GET /api/v1/analytics/stat-growth   ?stat_id=&days=90 → []{date, value}
GET /api/v1/analytics/summary       → { weekly_xp, avg_daily, best_streak, top_stat }
```

### Billing (gated by BillingEnabled flag)
```
POST /api/v1/webhooks/stripe
POST /api/v1/webhooks/yookassa
GET  /api/v1/subscription    → { tier, current_period_end }
```

All protected routes: `Authorization: Bearer <token>`.

---

## Middleware Requirements

**Auth middleware:**
- Extract JWT from `Authorization: Bearer`
- Inject `userID` into context via typed key (`type contextKey string`)
- Return `401 { "error": "..." }` on failure

**Logger middleware (slog):**
- Use `log/slog` (stdlib, Go 1.21+)
- Log: method, path, status, latency, userID
- Format: JSON to stdout

**CORS middleware:**
- Origins from `CORS_ORIGINS` env (comma-separated)
- Methods: GET, POST, PUT, DELETE, OPTIONS

**Rate limit middleware (`golang.org/x/time/rate`):**
- Per IP, in-memory `sync.Map` of `rate.Limiter`
- Auth endpoints: 5 req/min
- Activity log: 60 req/min
- Global: 300 req/min
- Return `429 { "error": "rate limit exceeded" }`

---

## Observability

```go
// GET /healthz — liveness
// Returns 200 { "status": "ok" } or 503 if DB ping fails

// GET /readyz — readiness
// Returns 200 only when DB pool has active connections
```

Use `log/slog` throughout — structured JSON logs, no `fmt.Println`.

---

## Graceful Shutdown

```go
// main.go
ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
defer stop()
// start server
// <-ctx.Done()
// srv.Shutdown(context.WithTimeout(context.Background(), 10*time.Second))
// close DB pool
```

---

## Landing Page (web/index.html)

Separate from the app. Must include:
- Hero section: tagline + CTA button "Начать бесплатно" → `/app.html`
- Features section: 3 cards (XP прогрессия / Streaks / Достижения)
- Pricing section: Free vs Pro comparison table (Pro locked behind `BillingEnabled` flag — show "Скоро" if disabled)
- FAQ: 5 questions
- Footer: /privacy, /terms links

SEO basics:
- `<title>Arkhe — Превратите жизнь в RPG</title>`
- `<meta name="description" content="...">`
- OpenGraph tags (`og:title`, `og:description`, `og:image`)
- `sitemap.xml` and `robots.txt` as static files in `web/`

---

## Legal Pages (static HTML)

```
web/privacy.html   — политика конфиденциальности (шаблон для РФ)
web/terms.html     — пользовательское соглашение / оферта
```

Must include consent checkbox on registration form: "Я принимаю условия использования и политику конфиденциальности".

---

## Onboarding Flow

Three steps, shown once after first login (when `character` is null):

**Step 1 — Class:**
- `student` — "Прокачиваю себя в универе"
- `worker` — "Расту профессионально"
- `schoolkid` — "Учусь и развиваюсь"

**Step 2 — Stats (pick 3–5 or add custom):**
- Физическая форма — 💪
- Умственное развитие — 🧠
- Дисциплина — 🎯
- Начитанность — 📚
- Социальные навыки — 🤝
- Custom: text input + emoji picker

**Step 3 — Display name**

After submit: `POST /api/v1/character` + `POST /api/v1/stats` (batch) → redirect to dashboard view.

---

## Dashboard

- Character name, class badge, level
- XP bar: filled = `(total_xp - XPRequired(level)) / (XPRequired(level+1) - XPRequired(level))`
- Streak counter with flame icon
- Stat cards: name, icon, stat_level, stat_streak, mini XP bar (stat progress), "+" button
- Recent activity feed (last 10), each entry shows xp_earned
- Quick-log modal: stat selector → description input → submit (no XP slider — server calculates)
- Toast notifications for achievement unlocks

---

## Design System

```css
:root {
  --bg:          #0d0d12;
  --surface:     #16161f;
  --surface-2:   #1e1e2e;
  --accent:      #7c3aed;
  --accent-glow: #a855f7;
  --text:        #e2e8f0;
  --text-muted:  #64748b;
  --border:      #2d2d3d;
  --xp-gradient: linear-gradient(90deg, #7c3aed, #a855f7);
}
```

**Typography:** Inter from Google Fonts, weights 400/500/600.
**Scale:** 12/16/20/24/32/48px only.
**Headings:** `letter-spacing: -0.02em`, `line-height: 1.2`.
**Numbers:** `font-variant-numeric: tabular-nums` on all XP/level displays.
**Cards:** `backdrop-filter: blur(12px)`, `border: 1px solid var(--border)`, `border-radius: 16px`.
**Mobile-first, responsive.**

---

## UI Motion Design

### XP Particle Burst

On activity submit: spawn 8 DOM nodes with `+XP` text, animate from button origin to XP bar via `getBoundingClientRect()`. Stagger 50ms per particle. On arrival: fade out, then fill XP bar with `cubic-bezier(0.34, 1.56, 0.64, 1)` over 400ms. Bar glows on fill complete.

```js
function fireXPParticles(originEl, xpAmount, xpBarEl) {
  const origin = originEl.getBoundingClientRect();
  const target = xpBarEl.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    const p = createParticleEl(`+${xpAmount} XP`);
    document.body.appendChild(p);
    animateParticle(p, origin, target, i * 50);
  }
}
```

### Level Up Overlay

Full-screen `rgba(13,13,18,0.92)` fade in 200ms → level number scale `0.4→1.0` spring 500ms → "LEVEL UP" small-caps fade 200ms after → stat cards cascade glow 100ms apart → auto-dismiss 2.5s or on click. No sound.

### Micro-interactions

```css
.btn-log:active { transform: scale(0.94); transition: transform 80ms ease; }
.btn-log        { transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1); }

.stat-card { transition: transform 200ms ease, box-shadow 200ms ease; }
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(124,58,237,0.15); }

@keyframes statGlow {
  0%   { box-shadow: 0 0 0 rgba(124,58,237,0); }
  40%  { box-shadow: 0 0 24px rgba(124,58,237,0.5); }
  100% { box-shadow: 0 0 0 rgba(124,58,237,0); }
}
```

### Modal

Slide-up + fade 280ms `ease-out`. Exit: fade only 150ms. Backdrop `blur(4px)`, click to dismiss. Submit disabled until description non-empty.

### Page Load

Header 0ms → XP bar fill 200ms (800ms duration) → stat cards stagger 80ms apart → feed 400ms. CSS `animation-delay` + `animation-fill-mode: both`, no JS.

### Prohibitions

- No `transition: all`
- No `setTimeout` for fake states
- No blur on mobile — gate with `@media (hover: hover)`
- Max 2 simultaneous animations

---

## Error Handling

- All errors return `{ "error": "message" }` with correct HTTP status
- Domain sentinel errors map to HTTP codes in central mapper
- Never expose raw DB or internal errors to client
- No `panic` outside `main()` init

---

## Configuration (.env)

```
DATABASE_URL=postgres://arkhe:secret@localhost:5432/arkhe?sslmode=disable
JWT_SECRET=change_me_min_32_chars
JWT_TTL_HOURS=24
SERVER_PORT=8080
CORS_ORIGINS=http://localhost:8080
BILLING_ENABLED=false
EMAIL_ENABLED=false
RESEND_API_KEY=
RESEND_FROM=Arkhe <noreply@arkhe.app>
```

---

## Makefile

```makefile
run:         go run ./cmd/server
build:       go build -o bin/arkhe ./cmd/server
migrate:     go run ./cmd/migrate
seed:        go run ./cmd/seed        # inserts achievements
test:        go test ./...
lint:        golangci-lint run
docker-up:   docker-compose up -d
docker-down: docker-compose down
```

---

## Code Quality

- No global state — DI via constructors
- No `interface{}` / `any` in domain and usecase layers
- All exported types have godoc comments
- All errors checked — no `_` on error returns
- All DB calls accept `context.Context` as first arg
- pgx pool: `MaxConns: 25`, `MinConns: 5`
- Raw `pgx/v5` queries only — no ORM

---

## Build Order for Claude Code

1. Scaffold full directory structure
2. Write all migrations (001–007)
3. Domain types + sentinel errors
4. Port interfaces
5. Postgres adapters
6. Usecases (auth → character → stat → activity → streak → achievement)
7. HTTP middleware (logger → cors → ratelimit → auth)
8. HTTP handlers
9. Email sender + workers (EMAIL_ENABLED gate)
10. `web/index.html` landing + legal pages
11. `web/app.html` onboarding + dashboard SPA
12. `web/assets/style.css` + `web/assets/app.js` with full motion design
13. docker-compose, Dockerfile, Makefile, .env.example
14. Verify: register → onboard → log activity → XP particles fire → streak increments → achievement check runs