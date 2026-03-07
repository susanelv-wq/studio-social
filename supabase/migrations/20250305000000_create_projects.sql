-- Projects table: stores full project JSON per client (anonymous or future user_id).
create table if not exists public.projects (
  id text primary key,
  client_id text not null,
  name text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for listing projects by client_id.
create index if not exists idx_projects_client_id on public.projects (client_id);

-- Optional: enable RLS and add policies when you add auth.
-- alter table public.projects enable row level security;
-- create policy "Users can manage own projects" on public.projects
--   for all using (auth.uid()::text = client_id);
