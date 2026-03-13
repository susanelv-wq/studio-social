-- Enable Row Level Security so each user only sees and edits their own projects.
-- client_id stores auth.uid()::text when the user is signed in.
alter table public.projects enable row level security;

-- Users can do everything on rows where client_id matches their auth id.
create policy "Users can manage own projects"
  on public.projects
  for all
  using (auth.uid()::text = client_id)
  with check (auth.uid()::text = client_id);
