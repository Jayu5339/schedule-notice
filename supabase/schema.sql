create extension if not exists "pgcrypto";

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null check (category in ('perf', 'submit', 'school', 'recruit')),
  event_date date not null,
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.events
  add column if not exists school_year integer not null default 2026,
  add column if not exists grade integer not null default 3,
  add column if not exists class_number integer not null default 2;

alter table public.events enable row level security;

create index if not exists idx_events_class_scope
  on public.events (school_year, grade, class_number, event_date);

-- 지금은 로그인 없이 누구나 읽고/쓰게 열어둠. 나중에 auth 붙이면
-- "using (auth.uid() = user_id)" 식으로 좁히면 됩니다.
create policy if not exists "public read" on public.events for select using (true);
create policy if not exists "public insert" on public.events for insert with check (true);
create policy if not exists "public delete" on public.events for delete using (true);