create extension if not exists "pgcrypto";

create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  default_operating_mode text not null default 'Assisted',
  goals text[] not null default '{}',
  topics text[] not null default '{}',
  target_audiences text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table platform_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  platform text not null check (platform in ('LinkedIn', 'X', 'Reddit')),
  handle text,
  status text not null default 'manual',
  encrypted_access_token text,
  encrypted_refresh_token text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, platform)
);

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  objective text not null,
  starts_on date,
  ends_on date,
  status text not null default 'active',
  platforms text[] not null default '{}',
  themes text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table campaign_targets (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  label text not null,
  domain text,
  created_at timestamptz not null default now()
);

create table content_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  platform text not null check (platform in ('LinkedIn', 'X', 'Reddit')),
  title text not null,
  current_body text not null,
  objective text not null,
  target_audience text,
  status text not null default 'draft',
  voice_match integer,
  research_confidence integer,
  recommendation text,
  warnings text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table content_versions (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references content_items(id) on delete cascade,
  body text not null,
  change_reason text,
  created_at timestamptz not null default now()
);

create table publishing_jobs (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references content_items(id) on delete cascade,
  platform text not null,
  scheduled_for timestamptz,
  status text not null default 'pending',
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  role text,
  organization text,
  domain text,
  location text,
  relevance_score integer,
  networking_distance text,
  notes text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table relationships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  person_id uuid not null references people(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  stage text not null default 'Cold',
  why_relevant text,
  next_suggested_action text,
  first_discovered_at timestamptz not null default now(),
  first_interaction_at timestamptz,
  last_interaction_at timestamptz,
  unique (user_id, person_id)
);

create table interactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  person_id uuid references people(id) on delete set null,
  relationship_id uuid references relationships(id) on delete set null,
  platform text check (platform in ('LinkedIn', 'X', 'Reddit')),
  interaction_type text not null,
  summary text not null,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'
);

create table topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  label text not null,
  explanation text,
  recommended_platform text,
  target_audience text,
  possible_angle text,
  relevance_score integer,
  created_at timestamptz not null default now()
);

create table opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  source text,
  likelihood text,
  why text,
  status text not null default 'needs_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  content_item_id uuid references content_items(id) on delete set null,
  platform text,
  event_type text not null,
  value numeric,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'
);

create table analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  label text not null,
  impressions integer not null default 0,
  profile_views integer not null default 0,
  relevant_followers integer not null default 0,
  reactions integer not null default 0,
  comments integer not null default 0,
  replies integer not null default 0,
  reposts integer not null default 0,
  conversations integer not null default 0,
  relationships integer not null default 0,
  opportunities integer not null default 0,
  captured_on date not null default current_date
);

create table memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  category text not null,
  value text not null,
  source text not null default 'user',
  editable boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  preference_key text not null,
  preference_value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, preference_key)
);

create table experiments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  hypothesis text not null,
  status text not null default 'planned',
  metric text,
  result_summary text,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create table research_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  content_item_id uuid references content_items(id) on delete set null,
  title text,
  url text not null,
  publisher text,
  accessed_at timestamptz not null default now(),
  notes text
);

create table system_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_name text not null,
  metric_value numeric,
  dimensions jsonb not null default '{}',
  captured_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  platform text,
  status text not null,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_campaigns_user_status on campaigns(user_id, status);
create index idx_content_user_platform_status on content_items(user_id, platform, status);
create index idx_people_user_domain on people(user_id, domain);
create index idx_relationships_user_stage on relationships(user_id, stage);
create index idx_interactions_user_occurred on interactions(user_id, occurred_at desc);
create index idx_analytics_events_user_type_time on analytics_events(user_id, event_type, occurred_at desc);
create index idx_memories_user_category on memories(user_id, category);
create index idx_audit_logs_created on audit_logs(created_at desc);
