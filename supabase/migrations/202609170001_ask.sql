-- Run once in the Supabase SQL editor, or apply with `supabase db push`.
-- Only Next.js server routes access these tables with the service role key.
create table if not exists public.ask_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(btrim(question)) between 15 and 1000),
  topic text not null default 'general'
    check (topic in ('general', 'backend', 'dotnet', 'databases', 'career')),
  answer text check (answer is null or char_length(btrim(answer)) between 1 and 8000),
  status text not null default 'pending'
    check (status in ('pending', 'answered', 'archived')),
  created_at timestamptz not null default now(),
  answered_at timestamptz,
  updated_at timestamptz not null default now(),
  check (status <> 'answered' or (answer is not null and answered_at is not null))
);

create index if not exists ask_questions_status_created_idx
  on public.ask_questions (status, created_at desc, id desc);

alter table public.ask_questions enable row level security;
revoke all on public.ask_questions from public, anon, authenticated;
grant select, insert, update on public.ask_questions to service_role;

create table if not exists public.ask_rate_limits (
  key text primary key,
  count integer not null,
  expires_at timestamptz not null
);
alter table public.ask_rate_limits enable row level security;
revoke all on public.ask_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on public.ask_rate_limits to service_role;

-- A single atomic upsert shares limits across concurrent Vercel instances.
-- Returns 0 when allowed, or the number of seconds until the next attempt.
create or replace function public.ask_consume_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
) returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
  bucket public.ask_rate_limits%rowtype;
begin
  if length(p_key) > 128 or p_limit < 1 or p_window_seconds not between 1 and 86400 then
    raise exception 'Invalid rate limit';
  end if;

  delete from public.ask_rate_limits where expires_at <= v_now;

  insert into public.ask_rate_limits as existing (key, count, expires_at)
    values (p_key, 1, v_now + make_interval(secs => p_window_seconds))
  on conflict (key) do update set
    count = case when existing.expires_at <= v_now then 1 else existing.count + 1 end,
    expires_at = case when existing.expires_at <= v_now
      then v_now + make_interval(secs => p_window_seconds)
      else existing.expires_at end
  returning * into bucket;

  if bucket.count > p_limit then
    return greatest(1, ceil(extract(epoch from (bucket.expires_at - clock_timestamp())))::integer);
  end if;
  return 0;
end;
$$;

revoke all on function public.ask_consume_rate_limit(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.ask_consume_rate_limit(text, integer, integer)
  to service_role;
