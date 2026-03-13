# Send sign-up and forgot-password emails (Supabase)

For **sign-up confirmation** and **forgot-password** emails to be delivered to your users, Supabase must send them through a **Custom SMTP** server. The built-in Supabase mailer only sends to pre-authorized team addresses and has strict rate limits.

## 1. Enable Custom SMTP in Supabase

1. Open your project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **Authentication** → **Providers** → **Email** and ensure **Confirm email** is enabled if you want new users to confirm their email.
3. Go to **Project Settings** (gear) → **Authentication** → **SMTP Settings**.
4. Turn **Enable Custom SMTP** on.
5. Fill in your SMTP provider’s details:
   - **Sender email:** e.g. `no-reply@yourdomain.com` or your Gmail address.
   - **Sender name:** e.g. `Studio Social`.
   - **Host:** e.g. `smtp.gmail.com` (Gmail) or your provider’s host.
   - **Port:** usually `587` (STARTTLS) or `465` (SSL).
   - **Username / Password:** your SMTP credentials (for Gmail, use an [App Password](https://support.google.com/accounts/answer/185833), not your normal password).

Save. After this, **sign-up confirmation** and **forgot-password** emails will be sent through your SMTP server to your users.

### Example: Gmail

- Host: `smtp.gmail.com`  
- Port: `587`  
- Username: your Gmail address  
- Password: [App Password](https://myaccount.google.com/apppasswords) (2FA required)

### Example: Resend

- Host: `smtp.resend.com`  
- Port: `465`  
- Username: `resend`  
- Password: your Resend API key  

See [Resend + Supabase](https://resend.com/docs/send-with-supabase-smtp) for details.

---

## 2. Allow redirect URLs

So that “Confirm your email” and “Reset password” links open your app (and not a Supabase-hosted page), add your URLs to the allowlist:

1. In the dashboard go to **Authentication** → **URL Configuration**.
2. Set **Site URL** to your production app URL, e.g. `https://socialstudio.pro`.
3. Under **Redirect URLs**, add:
   - `https://socialstudio.pro/`
   - `https://socialstudio.pro/auth/reset-password`
   - For local dev: `http://localhost:3000/` and `http://localhost:3000/auth/reset-password`

Without these, confirmation and reset links may be rejected by Supabase.

---

## Summary

| Goal                         | Action                                              |
|-----------------------------|-----------------------------------------------------|
| Sign-up emails to users     | Enable **Custom SMTP** (Project Settings → Auth → SMTP). |
| Forgot-password emails      | Same Custom SMTP; no extra code.                    |
| Links open your app         | Add **Redirect URLs** in Authentication → URL Configuration. |

More: [Supabase – Send emails with custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp).
