
# Arkhe

A gamification platform that turns real-world activities into RPG progression. Log actions, level up stats, maintain streaks, unlock achievements.

## Share with friends

To give a friend a link to your local server:

```bash
# Install once
brew install cloudflare/cloudflare/cloudflared

# Start the server (if not already running)
make start

# Create a public tunnel
cloudflared tunnel --url http://localhost:8080
```

The output will contain a link like `https://xxx-yyy-zzz.trycloudflare.com` — share it with your friend. Works as long as the terminal is open.

---

## Quick start

```bash
git clone https://github.com/Shipovmax/arkhe.git
cd arkhe
cp .env.example .env   # fill in the variables
make dev
```

Open [http://localhost:8080](http://localhost:8080).

`make dev` does everything for you: starts Postgres in Docker, applies migrations, runs the server.

> **Requirements:** Go 1.26+, Docker

---

## Commands

| Command | What it does |
|---------|-----------|
| `make dev` | Postgres in Docker + server locally (hot reload) |
| `make start` | Everything in Docker (prod mode) |
| `make build` | Build binary to `bin/arkhe` |
| `make docker-down` | Stop Docker containers |

---

## Configuration `.env`

```env
DATABASE_URL=postgres://arkhe:secret@localhost:5432/arkhe?sslmode=disable
JWT_SECRET=change_me_in_production_min_32_chars_long
JWT_TTL_HOURS=24
SERVER_PORT=8080
CORS_ORIGINS=http://localhost:8080

# Email notifications (optional, via Resend)
EMAIL_ENABLED=false
RESEND_API_KEY=
RESEND_FROM="Arkhe <noreply@arkhe.app>"

# Billing (stub)
BILLING_ENABLED=false
```

---

## How XP works

**XP formula per activity:**
```
XP = 100 × streak_multiplier × frequency_bonus
```

| Streak | Multiplier |
|-------|-----------|
| 0–2 periods | ×1.0 |
| 3–6 periods | ×1.25 |
| 7–13 periods | ×1.5 |
| 14+ periods | ×2.0 |

Bonus ×1.1 if logged in the first half of your frequency period.

**Character level thresholds** (total XP of all stats):

| Level | XP required | Activities per level |
|---------|----------|------------------------|
| Lv.2 | 300 XP | ~3 |
| Lv.3 | 800 XP | ~5 |
| Lv.4 | 1,600 XP | ~8 |
| Lv.5 | 2,800 XP | ~12 |
| Lv.10 | 16,500 XP | ~38 |

Formula: `XP(n) = 100 × (n³ + 11n − 12) / 6`

---

## Architecture

```
arkhe/
├── cmd/server/          # entry point, DI wiring
├── cmd/migrate/         # migration runner
├── internal/
│   ├── domain/          # business entities, XP formulas
│   ├── port/            # repository interfaces
│   ├── usecase/         # business logic
│   ├── adapter/
│   │   ├── postgres/    # repository implementations (pgx/v5)
│   │   └── http/        # handlers, middleware, router
│   ├── email/           # Resend email sender
│   └── infrastructure/  # config, connection pool, migrations
├── migrations/          # SQL migrations
└── web/                 # static files (HTML + CSS + JS SPA)
```

**Stack:** Go 1.26 · PostgreSQL 16 · pgx/v5 · JWT HS256 · Vanilla JS · Docker Compose

---

## API

```
POST /api/v1/auth/register   { email, password, display_name, class, stats[] }
POST /api/v1/auth/login      { email, password }

GET  /api/v1/character
PUT  /api/v1/character       { display_name }

GET    /api/v1/stats
POST   /api/v1/stats         { name, icon, frequency_days }
PATCH  /api/v1/stats/{id}    { frequency_days }
DELETE /api/v1/stats/{id}

POST /api/v1/activities      { stat_id, description }
GET  /api/v1/activities      ?limit=20&offset=0

GET /api/v1/analytics/summary
GET /healthz
```

All protected routes require `Authorization: Bearer <token>`.

---

## Manual testing

### Landing page (`/`)
- [ ] Page loads, Hero section is visible
- [ ] "Start" button → navigates to `/app.html`
- [ ] FAQ expands, pricing block is displayed

### Registration
- [ ] Registration form: email + password + name + class + stats
- [ ] Email without `@` — shows validation error
- [ ] Weak password (<6 chars) — shows error
- [ ] Show/hide password button works
- [ ] Successful registration → onboarding or dashboard
- [ ] Duplicate registration with same email → error "already taken"

### Login
- [ ] Correct email + password → dashboard
- [ ] Wrong password → error message
- [ ] "No account?" link switches to registration form

### Onboarding (new user)
- [ ] Can enter display name and choose class
- [ ] Add stat (name, icon, frequency)
- [ ] Delete stat from the list
- [ ] Save character → redirect to dashboard

### Dashboard
- [ ] XP arc animates on load
- [ ] Shows level, class, name, streak, XP
- [ ] Click on name → dropdown menu opens
- [ ] Dropdown: "Log out" → logs out and returns to start screen
- [ ] Stat cards show level, streak, XP bar, "+ Log" button

### Activity logging
- [ ] Click "+ Log" → modal with description
- [ ] Empty description → button disabled / error
- [ ] Successful log → particles fly to the arc, XP updates
- [ ] Arc animates to new value
- [ ] On level up → resets to 0 and fills again
- [ ] Stat card pulses (xp-pulse)
- [ ] On level up → level-up overlay appears
- [ ] On stat level up → toast notification
- [ ] New activity appears in "Recent activities"

### Achievements
- [ ] After logging, a toast appears if an achievement is unlocked

---

## Features

- **Per-stat progression** — each stat levels up independently with its own level and XP
- **Streak per stat** — individual frequency for each skill
- **Cubic progression** — each level requires more effort
- **XP animations** — particles fly to the XP ring, level-up overlay
- **Achievements** — checked asynchronously after each activity
- **Rate limiting** — per-IP (5 req/min on auth, 60 req/min on API)
- **Graceful shutdown** — SIGINT/SIGTERM, 10 sec to finish
- **Migrations** — embedded runner, no external tools
