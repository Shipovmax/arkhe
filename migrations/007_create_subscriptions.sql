CREATE TYPE subscription_tier AS ENUM ('free', 'pro');

CREATE TABLE subscriptions (
    user_id            UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    tier               subscription_tier NOT NULL DEFAULT 'free',
    provider           TEXT,
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
