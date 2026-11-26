-- Admin login tries (SporkIt website, /admin). Safe to re-run.
-- Only the website server (service role key) reads or writes this table: RLS is on and there are NO policies.
create table if not exists public.admin_login_attempts (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  ok         boolean not null,
  totp_step  bigint            -- the 30-second authenticator step used by a successful login (a code works once)
);
create index if not exists admin_login_attempts_created_idx on public.admin_login_attempts (created_at desc);
alter table public.admin_login_attempts enable row level security;
revoke all on public.admin_login_attempts from anon, authenticated;
