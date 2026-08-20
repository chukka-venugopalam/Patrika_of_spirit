-- AwareNet V1 — Fresh schema
-- Run in Supabase SQL editor on a clean project.
-- Assumes Supabase's built-in `auth.users` table exists already.

-- ============================================================
-- 1. PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  allow_public_attribution boolean not null default false, -- privacy toggle
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. POSTS (the awareness content — root of every chain)
-- ============================================================
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  category text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "Posts are viewable by everyone"
  on public.posts for select
  using (true);

create policy "Only creators can insert posts"
  on public.posts for insert
  with check (auth.uid() = created_by);

-- ============================================================
-- 3. SHARE_LINKS
-- ============================================================
create table public.share_links (
  token uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  actor_id uuid not null references public.profiles(id),
  parent_token uuid references public.share_links(token),
  created_at timestamptz not null default now()
);

alter table public.share_links enable row level security;

create policy "Share links are viewable by everyone"
  on public.share_links for select
  using (true);

create policy "Users can create their own share links"
  on public.share_links for insert
  with check (auth.uid() = actor_id);

-- ============================================================
-- 4. AWARENESS_EVENTS (the chain itself)
-- ============================================================
create type public.event_type as enum ('view', 'share');

create table public.awareness_events (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  event_type public.event_type not null,
  share_token uuid references public.share_links(token),
  parent_event_id uuid references public.awareness_events(id),
  session_id text,
  created_at timestamptz not null default now()
);

create index idx_events_post on public.awareness_events(post_id);
create index idx_events_parent on public.awareness_events(parent_event_id);
create index idx_events_actor on public.awareness_events(actor_id);
create index idx_events_share_token on public.awareness_events(share_token);

alter table public.awareness_events enable row level security;

create policy "Events are viewable by everyone"
  on public.awareness_events for select
  using (true);

create policy "Authenticated users can insert their own events"
  on public.awareness_events for insert
  with check (auth.uid() = actor_id or actor_id is null);

create unique index idx_unique_view_per_session
  on public.awareness_events (share_token, session_id)
  where event_type = 'view' and session_id is not null;

-- ============================================================
-- 5. Helper view: reach per user
-- ============================================================
create view public.user_reach as
select
  actor_id,
  count(distinct case when event_type = 'view' then id end) as total_views_generated,
  count(distinct case when event_type = 'share' then id end) as total_shares_made,
  count(distinct post_id) as posts_touched
from public.awareness_events
where actor_id is not null
group by actor_id;
