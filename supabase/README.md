# Supabase setup

1. Create a project at [supabase.com](https://supabase.com) and get your project URL and anon key from **Settings → API**.

2. Copy `.env.local.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Run the migration in the Supabase SQL editor (**SQL Editor** in the dashboard):
   - Paste and run the contents of `migrations/20250305000000_create_projects.sql`.

4. Run `npm install` (or `pnpm install`) so `@supabase/supabase-js` is installed.

With these in place, projects are stored in Supabase. Without env vars, the app keeps using localStorage.
