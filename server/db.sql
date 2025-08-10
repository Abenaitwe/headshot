-- Subscriptions table to track Freemius subscription state
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_email text,
  user_id bigint,
  license_id bigint,
  subscription_id bigint,
  plan_id text,
  plan_key text,
  status text,
  renews_at timestamptz,
  transformations_limit int,
  transformations_used int default 0,
  last_event_at timestamptz,
  raw_payload jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ensure columns exist (idempotent)
alter table public.subscriptions add column if not exists transformations_limit int;
alter table public.subscriptions add column if not exists transformations_used int default 0;

-- Upsert targets
create unique index if not exists subscriptions_subscription_id_key on public.subscriptions (subscription_id) where subscription_id is not null;
create unique index if not exists subscriptions_license_id_key on public.subscriptions (license_id) where license_id is not null;
create unique index if not exists subscriptions_user_email_key on public.subscriptions (lower(user_email)) where user_email is not null;

-- Optional RLS config (adjust as needed)
-- alter table public.subscriptions enable row level security;
-- create policy "Allow read to anon" on public.subscriptions for select to anon using (true);
-- create policy "Allow service role full access" on public.subscriptions for all using (true) with check (true); 