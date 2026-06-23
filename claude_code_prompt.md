# Claude Code Prompt — LifeRPG (Gamification SaaS)

## Project Overview

Build a production-ready web application called **LifeRPG** — a gamification platform that turns real-life activities into RPG progression. Users log activities (gym, reading, studying), earn XP, level up stats, and track long-term growth through a character-building interface.

---

## Tech Stack (Non-Negotiable)

**Backend:** Go 1.23+
- `net/http` standard library for routing (no Gin/Echo — justify every dependency)
- `pgx/v5` for PostgreSQL
- `golang-jwt/jwt/v5` for auth
- `golang.org/x/crypto` for bcrypt
- `google/uuid` for UUIDs

**Database:** PostgreSQL 16

**Frontend:** Pure HTML + CSS + Vanilla JS (no React/Vue — keep it deployable as static files served by Go)

**Containerization:** Docker + docker-compose

**Config:** `github.com/ilyakaznacheev/cleanenv` or plain `os.Getenv` — no viper

---

## Architecture

Use **Clean Architecture** with strict layer separation:

```
liferpg/
├── cmd/
│   └── server/
│       └── main.go                  # Entry point, DI wiring only
├── internal/
│   ├── domain/                      # Pure business entities, no imports from other layers
│   │   ├── user.go
│   │   ├── character.go
│   │   ├── stat.go
│   │   ├── activity.go
│   │   └── errors.go                # Sentinel domain errors
│   ├── usecase/                     # Business logic, depends only on domain + ports
│   │   ├── auth.go
│   │   ├── character.go
│   │   ├── activity.go
│   │   └── stat.go
│   ├── port/                        # Interfaces (repository contracts)
│   │   ├── user_repository.go
│   │   ├── character_repository.go
│   │   ├── activity_repository.go
│   │   └── stat_repository.go
│   ├── adapter/
│   │   ├── postgres/                # Implements port interfaces
│   │   │   ├── user_repo.go
│   │   │   ├── character_repo.go
│   │   │   ├── activity_repo.go
│   │   │   └── stat_repo.go
│   │   └── http/                    # HTTP handlers, middleware, routing
│   │       ├── router.go
│   │       ├── middleware/
│   │       │   ├── auth.go
│   │       │   ├── cors.go
│   │       │   └── logger.go
│   │       └── handler/
│   │           ├── auth.go
│   │           ├── character.go
│   │           ├── activity.go
│   │           └── stat.go
│   └── infrastructure/
│       ├── postgres.go              # Pool init, migrations runner
│       └── config.go
├── migrations/                      # SQL migration files (numbered)
│   ├── 001_create_users.sql
│   ├── 002_create_characters.sql
│   ├── 003_create_stats.sql
│   └── 004_create_activities.sql
├── web/                             # Static frontend
│   ├── index.html                   # Landing + auth gate
│   ├── onboarding.html
│   ├── dashboard.html
│   └── assets/
│       ├── style.css
│       └── app.js
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── Makefile
```

---

## Database Schema

### users
```sql
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### characters
```sql
CREATE TYPE character_class AS ENUM ('student', 'worker', 'schoolkid');

CREATE TABLE characters (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name    TEXT NOT NULL,
    class           character_class NOT NULL,
    level           INT NOT NULL DEFAULT 1,
    total_xp        BIGINT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);
```

### stats
```sql
CREATE TABLE stats (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id    UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    icon            TEXT NOT NULL DEFAULT '⚡',
    current_value   INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(character_id, name)
);
```

### activities
```sql
CREATE TABLE activities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id    UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    stat_id         UUID NOT NULL REFERENCES stats(id),
    description     TEXT NOT NULL,
    xp_earned       INT NOT NULL,
    logged_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## XP Formula (Business Logic — Critical)

Level thresholds use exponential scaling:

```go
// XPRequired returns total XP needed to reach the given level from level 1.
// Formula: base * level^exponent
// base = 100, exponent = 1.5
func XPRequired(level int) int64 {
    return int64(100 * math.Pow(float64(level), 1.5))
}

// LevelFromXP derives current level from total accumulated XP.
func LevelFromXP(totalXP int64) int {
    level := 1
    for XPRequired(level+1) <= totalXP {
        level++
    }
    return level
}
```

XP per activity is determined by the client but validated server-side: **min 10, max 500 per log entry**.

Stat value increase per activity: `+1` to the linked stat's `current_value` per log entry (simple additive for MVP).

---

## API Specification

### Auth
```
POST /api/v1/auth/register     { email, password, display_name, class }
POST /api/v1/auth/login        { email, password } → { token, character }
```

### Character
```
GET  /api/v1/character         → full character with stats and level info
PUT  /api/v1/character         { display_name }
```

### Stats
```
GET  /api/v1/stats             → []stat
POST /api/v1/stats             { name, icon } → stat
DELETE /api/v1/stats/:id
```

### Activities
```
POST /api/v1/activities        { stat_id, description, xp_amount }
GET  /api/v1/activities        ?limit=20&offset=0 → []activity
```

All protected routes require `Authorization: Bearer <token>` header.

---

## Onboarding Flow (Frontend Logic)

Three-step onboarding on first login (character not yet created):

**Step 1 — Class selection:**
- `student` (Студент) — "Прокачиваю себя в универе"
- `worker` (Работяга) — "Расту профессионально"
- `schoolkid` (Школьник) — "Учусь и развиваюсь"

**Step 2 — Stat selection:**
Pre-seeded options (user picks 3-5, or adds custom):
- Physical (Физическая форма) — icon: 💪
- Mental (Умственное развитие) — icon: 🧠
- Discipline (Дисциплина) — icon: 🎯
- Reading (Начитанность) — icon: 📚
- Social (Социальные навыки) — icon: 🤝
- Custom — user types name + picks emoji

**Step 3 — Display name** (username shown on dashboard)

After onboarding: redirect to `/dashboard.html`

---

## Dashboard Requirements

Display:
- Character name, class badge, current level
- XP bar: current XP / XP needed for next level (visual progress bar)
- Stat cards: each stat shows name, icon, current value, and a button "Залогировать активность"
- Recent activity feed (last 10 entries)
- Quick-log modal: select stat → write description → set XP (slider 10-500) → submit

---

## Design System

**Color palette (Purple Minimal):**
```css
--bg:         #0d0d12;
--surface:    #16161f;
--surface-2:  #1e1e2e;
--accent:     #7c3aed;       /* primary purple */
--accent-glow:#a855f7;       /* lighter for hover/glow */
--text:       #e2e8f0;
--text-muted: #64748b;
--border:     #2d2d3d;
--xp-bar:     linear-gradient(90deg, #7c3aed, #a855f7);
```

**Typography:** `Inter` from Google Fonts, weights 400/500/600

**Visual style:**
- Dark background, glassmorphism cards (`backdrop-filter: blur(12px)`, semi-transparent borders)
- XP bar with gradient fill and subtle glow
- Stat cards: dark surface with accent border-left
- Minimal animations: fade-in on load, smooth XP bar fill
- No gradients on backgrounds — flat dark only
- Mobile-first, responsive

---

## UI Motion Design & Micro-interactions (Critical — This Is the Product)

The UI must feel like a premium native app. Every interaction has a physical response. No jarring jumps, no instant state changes. Motion carries meaning.

---

### XP Particle Burst Animation (Highest Priority)

When user submits an activity log, trigger this sequence:

1. **Burst origin:** the submit button (or the stat card's log button)
2. **Particles:** spawn 6–10 small `+XP` text nodes (e.g. `+150 XP`) as absolutely-positioned DOM elements
3. **Motion:** each particle flies toward the XP progress bar using CSS keyframe animation with randomized angle offset (±30deg from the target vector). Duration: 600–900ms, staggered by 50ms each
4. **On arrival:** particle fades out at XP bar position, XP bar fills smoothly to new value over 400ms with `cubic-bezier(0.34, 1.56, 0.64, 1)` (slight overshoot spring)
5. **XP bar glow pulse:** `box-shadow` pulses once on the accent color when fill completes

Implementation: pure CSS keyframes + JS for DOM injection and target coordinate calculation via `getBoundingClientRect()`. No canvas needed.

```js
// Pseudocode structure — implement fully:
function fireXPParticles(originEl, xpAmount, xpBarEl) {
  const origin = originEl.getBoundingClientRect();
  const target = xpBarEl.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    const particle = createParticleEl(`+${xpAmount} XP`);
    document.body.appendChild(particle);
    animateParticle(particle, origin, target, i * 50); // stagger
  }
}
```

---

### Level Up — Cinematic Moment

When `LevelFromXP(newXP) > LevelFromXP(oldXP)`:

1. Full-screen overlay fades in (`rgba(13,13,18,0.92)`) over 200ms
2. Center: large level number animates in with scale `0.4 → 1.0` + fade, spring easing, 500ms
3. Subtitle: "LEVEL UP" in small caps, letter-spacing 0.3em, fades in 200ms after number
4. Stat cards below briefly flash accent border glow (cascade, 100ms apart)
5. Overlay auto-dismisses after 2.5s or on any click
6. **No sound** (don't add Web Audio — keep it clean for MVP)

---

### Button & Card Micro-interactions

Every interactive element must have tactile feedback:

```css
/* Log button press */
.btn-log:active {
  transform: scale(0.94);
  transition: transform 80ms ease;
}
.btn-log {
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Stat card hover */
.stat-card {
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.15);
}

/* Card on XP received — brief glow pulse */
.stat-card.xp-pulse {
  animation: statGlow 600ms ease forwards;
}
@keyframes statGlow {
  0%   { box-shadow: 0 0 0 rgba(124,58,237,0); }
  40%  { box-shadow: 0 0 24px rgba(124,58,237,0.5); }
  100% { box-shadow: 0 0 0 rgba(124,58,237,0); }
}
```

---

### Modal (Quick-log) Behavior

- Entry: slides up from bottom + fade, `translateY(40px) → translateY(0)`, 280ms, `ease-out`
- Exit: fade only, 150ms — faster exits feel snappier
- Backdrop: click dismisses, `backdrop-filter: blur(4px)` on the overlay
- XP slider: custom styled range input with live `+XP` label that updates on drag
- Submit button: disabled state until description is non-empty (opacity 0.4, `not-allowed` cursor)

---

### Page Load — Staggered Entrance

On dashboard load, elements animate in sequentially:

1. Header fades in: 0ms delay, 300ms
2. XP bar fills from 0 to current value: 200ms delay, 800ms (telegraphs progress immediately)
3. Stat cards: stagger 80ms apart, each `translateY(16px) → 0` + fade, 350ms
4. Activity feed: after all cards, 400ms fade in

Use CSS `animation-delay` with `animation-fill-mode: both` — no JS needed for this.

---

### Typography & Spacing Rules (Apple-style)

- **Font sizes:** use a strict 4px base scale — 12/16/20/24/32/48px only
- **Line height:** 1.5 for body, 1.2 for headings
- **Letter spacing:** `-0.02em` on headings (tighter = premium), `0` on body
- **Whitespace:** generous — minimum 24px padding inside cards, 32px between sections
- **Numbers (XP, Level):** use `font-variant-numeric: tabular-nums` so digits don't jump width during animation
- **Hierarchy:** achieve contrast through weight (400/600) and opacity (100%/50%), NOT through font size changes alone

---

### What NOT to Do (Explicit Prohibitions)

- No CSS transitions on `all` — specify exact properties
- No `setTimeout` hacks to fake loading states
- No skeleton loaders for MVP — just instant render after fetch
- No bouncy animations on navigation — only on interactive feedback
- No more than 2 simultaneous animations on screen at once
- No blur effects on mobile (performance) — use `@media (hover: hover)` to gate them

---



**Auth middleware:**
- Extract JWT from `Authorization: Bearer` header
- Validate signature + expiry
- Inject `userID` into request context via typed key (not string key — use a custom type)
- Return `401` with JSON error on failure

**Logger middleware:**
- Log: method, path, status code, latency, userID (if authenticated)
- Format: structured (JSON lines), go to stdout

**CORS middleware:**
- Allow origins: configurable via env
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization

---

## Error Handling Rules

1. All handler errors return `{ "error": "human-readable message" }` JSON with correct HTTP status
2. Domain errors (e.g. `ErrNotFound`, `ErrAlreadyExists`) map to specific HTTP codes in a central error mapper
3. Never expose internal error strings to clients
4. All repository functions return typed errors, never raw `pg` errors to upper layers
5. No `panic` anywhere except `main()` for fatal init failures

---

## Configuration (.env)

```
DATABASE_URL=postgres://liferpg:secret@localhost:5432/liferpg?sslmode=disable
JWT_SECRET=change_me_in_production_min_32_chars
JWT_TTL_HOURS=24
SERVER_PORT=8080
CORS_ORIGINS=http://localhost:8080
```

---

## Makefile Targets

```makefile
run:        # go run ./cmd/server
build:      # go build -o bin/liferpg ./cmd/server
migrate:    # apply all SQL migrations
test:       # go test ./...
lint:       # golangci-lint run
docker-up:  # docker-compose up -d
docker-down:# docker-compose down
```

---

## Code Quality Requirements

- **No global state** — all dependencies injected via constructors
- **No `interface{}` or `any`** in domain/usecase layers
- **All exported types** have godoc comments
- **All errors** checked — no `_` for error returns
- **Context propagation** — all DB calls accept `context.Context` as first arg
- **`sync.RWMutex`** not needed (PostgreSQL handles concurrency), but connection pool must be configured: `MaxConns: 25`, `MinConns: 5`
- Repository methods must use **prepared statements** via pgx named queries, not raw string interpolation

---

## Start Instructions for Claude Code

1. Scaffold the full directory structure first
2. Write migrations first, then domain types, then ports, then adapters, then usecases, then handlers
3. Serve static files from `web/` directory via Go's `http.FileServer`
4. Write `docker-compose.yml` with postgres + app services
5. Do NOT use any ORM — raw `pgx/v5` only
6. Test the full onboarding flow manually before considering the task done
