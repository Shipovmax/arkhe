# Arkhe — Claude контекст

## Что это

Геймификационная платформа. Пользователь создаёт RPG-персонажа, выбирает навыки (статы), логирует реальные активности и получает XP. Есть стрики, ачивменты, уровни. Аудитория — люди которые хотят строить привычки через игровую механику.

## Стек

- **Backend:** Go 1.26, net/http, pgx/v5, JWT HS256, bcrypt
- **DB:** PostgreSQL 16
- **Frontend:** Vanilla JS SPA (без фреймворков), CSS custom properties
- **Infra:** Docker Compose (сервисы: `db`, `app`), Cloudflare Tunnel для шаринга

## Архитектура

Чистая архитектура:
```
domain/        — сущности, формулы XP, ошибки
port/          — интерфейсы репозиториев
usecase/       — бизнес-логика
adapter/
  postgres/    — реализации репозиториев
  http/
    handler/   — HTTP хендлеры
    middleware/ — auth, cors, rate limit, logger
    router.go  — роутинг
infrastructure/ — config, pool, migrations
```

## Запуск

```bash
# Поднять всё (Docker нужен — OrbStack)
docker-compose up -d

# Локально (Go + Docker только для DB)
make dev

# Туннель для шаринга с друзьями
cloudflared tunnel --url http://localhost:8080
```

`.env` уже есть с дефолтными значениями. В Docker нужен `DATABASE_URL=postgres://arkhe:secret@db:5432/arkhe` (не localhost).

## API

```
POST /api/v1/auth/register   { email, password, display_name, class, stats[] }
POST /api/v1/auth/login      { email, password }
GET  /api/v1/character
PUT  /api/v1/character
GET/POST/PATCH/DELETE /api/v1/stats, /api/v1/stats/{id}
POST/GET /api/v1/activities
GET  /api/v1/achievements
GET  /api/v1/analytics/summary
GET  /api/v1/analytics/xp-history?days=30
```

## Фронт (web/)

- `index.html` — лендинг
- `app.html` — обёртка SPA
- `assets/app.js` — весь JS (~1300 строк): auth, onboarding, dashboard, модалки, i18n
- `assets/style.css` — тёмная тема, mobile-first

### Ключевые паттерны в JS

- `t('key')` — i18n, поддерживает RU/EN, автодетект из браузера, `LANG_KEY` в localStorage
- `api(method, path, body)` — все запросы, кидает ошибку если !res.ok
- `state` — глобальный объект `{ character, stats, activities }`
- `showAuth()` / `showOnboarding()` / `showDashboard()` — роутинг экранов

## XP формула

```
XP = 100 × streak_multiplier × frequency_bonus
streak: ×1.0 (0-2) / ×1.25 (3-6) / ×1.5 (7-13) / ×2.0 (14+)
frequency_bonus: ×1.1 если залогировал в первой половине периода
```

Уровень: `XP(n) = 100 × (n³ + 11n − 12) / 6`

## Что уже сделано

- [x] Мобильный адаптив (mobile-first CSS, iOS zoom fix)
- [x] Кулдаун активности — нельзя залогировать дважды за период (ErrTooSoon → 429)
- [x] Bubble-выбор подкатегорий в онбординге (Зал, Бег, Йога...)
- [x] Частота через +/− с анимацией числа
- [x] Добавление/удаление статов прямо с дашборда
- [x] 13 ачивментов с экраном карточек
- [x] XP-график 30 дней + CSV экспорт
- [x] RU/EN i18n, переключатель в меню
- [x] Лендинг с продающим текстом

## В планах (backlog)

- Push-уведомления о стриках
- Социальные фичи (leaderboard)
- Pro тариф (Stripe)
- Мобильное приложение
