# Supabase setup

1. Create a project at [supabase.com](https://supabase.com) and get your project URL and anon key from **Settings → API**.

2. **Enable Email auth:** In the dashboard go to **Authentication** → **Providers** → enable **Email**. (Optional: enable "Confirm email" so new users get a confirmation email.)

   **To actually deliver sign-up and forgot-password emails to users**, configure **Custom SMTP** in **Project Settings** → **Authentication** → **SMTP Settings**. See [EMAIL-SETUP.md](../EMAIL-SETUP.md) in the project root for step-by-step instructions.

3. Copy `.env.local.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Run the migration in the Supabase **SQL Editor**:
   - Paste and run the contents of `migrations/20250305000000_create_projects.sql`.

5. Run `npm install` (or `pnpm install`) so `@supabase/supabase-js` is installed.

6. **Redirect URL for password reset:** In **Authentication** → **URL Configuration** → **Redirect URLs**, add your app URL plus `/auth/reset-password`, e.g. `https://yoursite.com/auth/reset-password` and `http://localhost:3000/auth/reset-password` for local dev.

With these in place, projects are stored in Supabase and users can **Sign in / Sign up / Log out / Forgot password**. Projects are saved per user when signed in. Without env vars, the app uses localStorage only and no auth UI.
