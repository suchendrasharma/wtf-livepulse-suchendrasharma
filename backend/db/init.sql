-- backend/db/init.sql
BEGIN;

CREATE TABLE IF NOT EXISTS gyms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  gym_id INTEGER NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  plan_type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS checkins (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  gym_id INTEGER NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  checked_in TIMESTAMP NOT NULL DEFAULT NOW(),
  checked_out TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  gym_id INTEGER NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  plan_type TEXT NOT NULL,
  paid_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS anomalies (
  id SERIAL PRIMARY KEY,
  gym_id INTEGER NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  detected_at TIMESTAMP NOT NULL DEFAULT NOW(),
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at TIMESTAMP,
  UNIQUE (gym_id, type, resolved)
);

-- seed data
INSERT INTO gyms (name, capacity) VALUES
('Downtown Fitness', 120),
('Northside Strength', 80),
('Lakeside Yoga', 50)
ON CONFLICT DO NOTHING;

-- ensure at least one member per gym
INSERT INTO members (gym_id, name, plan_type)
SELECT g.id, 'Member ' || g.id || '-' || n, 'monthly'
FROM gyms g, generate_series(1, 25) AS n
ON CONFLICT DO NOTHING;

-- seed some checkins and payments for last 1 day
INSERT INTO checkins (member_id, gym_id, checked_in, checked_out)
SELECT m.id, m.gym_id, NOW() - (random() * INTERVAL '5 hours'), NOW() - (random() * INTERVAL '2 hours')
FROM members m
WHERE random() < 0.15
ON CONFLICT DO NOTHING;

INSERT INTO payments (member_id, gym_id, amount, plan_type, paid_at)
SELECT m.id, m.gym_id, 1499, 'monthly', NOW() - (random() * INTERVAL '7 days')
FROM members m
WHERE random() < 0.2
ON CONFLICT DO NOTHING;

COMMIT;
