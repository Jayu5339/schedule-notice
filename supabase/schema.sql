create extension if not exists "pgcrypto";

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null check (category in ('perf', 'submit', 'school', 'recruit')),
  event_date date not null,
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

alter table events enable row level security;

-- 지금은 로그인 없이 누구나 읽고/쓰게 열어둠. 나중에 auth 붙이면
-- "using (auth.uid() = user_id)" 식으로 좁히면 됩니다.
create policy "public read" on events for select using (true);
create policy "public insert" on events for insert with check (true);
create policy "public delete" on events for delete using (true);