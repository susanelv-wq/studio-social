# Deploy Studio Social to VPS (76.13.195.111) on port 3002 with aaPanel

## Overview

- **VPS:** 76.13.195.111  
- **App port:** 3002  
- **Panel:** aaPanel (Nginx reverse proxy to Node.js)

---

## 1. On your local machine (prepare build)

```bash
cd "/Users/susanelv/Desktop/Studio Social"

# Install deps and build
npm ci
npm run build
```

Create `.env.production` on the **server** (see step 3). Do **not** commit real keys. You’ll copy Supabase and OpenAI vars to the VPS.

---

## 2. Upload project to the VPS

**Option A – rsync (recommended)**

```bash
# From your Mac, sync project to VPS (replace YOUR_USER with your SSH user, e.g. root)
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  ./ YOUR_USER@76.13.195.111:/www/wwwroot/studio-social/
```

Then on the server you’ll run `npm ci` and `npm run build` (step 3).

**Option B – Git (if repo is on GitHub)**

On the VPS:

```bash
cd /www/wwwroot
git clone https://github.com/susanelv-wq/studio-social.git
cd studio-social
```

Then install, add env, build, and start with PM2 (step 3).

---

## 3. On the VPS (SSH in)

```bash
ssh YOUR_USER@76.13.195.111
```

Install Node.js 18+ if needed (aaPanel: **App Store** → **Node.js** or use Node version manager).

```bash
cd /www/wwwroot/studio-social   # or your chosen path
```

Create env file (use your real values):

```bash
nano .env.production
```

Paste (replace with your keys):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI (for Generate with AI images)
OPENAI_API_KEY=sk-your-openai-key
```

Save (Ctrl+O, Enter, Ctrl+X).

Install dependencies (include dev – the build needs Tailwind/PostCSS/TypeScript):

```bash
npm ci
npm run build
```

Optional: remove dev dependencies after build to save disk (then only `next start` runs):

```bash
npm prune --production
```

Start on port 3002 with PM2:

```bash
# Install PM2 if not installed
npm install -g pm2

# Start app (listens on 0.0.0.0:3002)
pm2 start ecosystem.config.cjs

# Optional: save process list so it restarts on reboot
pm2 save
pm2 startup
```

Check:

```bash
pm2 status
curl -I http://127.0.0.1:3002
```

---

## 4. aaPanel – reverse proxy (domain or port 3002)

### Option A – Use a domain (e.g. studio.yourdomain.com)

1. In aaPanel: **Website** → **Add site** → enter domain, create.
2. For that site: **Settings** → **Reverse proxy**.
3. **Add reverse proxy:**
   - **Proxy name:** studio-social  
   - **Target URL:** `http://127.0.0.1:3002`  
   - **Send domain:** usually same as your front-end domain (e.g. `$host`).  
4. Save. Your app is available at `https://studio.yourdomain.com` (enable SSL in aaPanel if needed).

### Option B – Expose port 3002 only (no domain)

1. In aaPanel: **Security** (or firewall) → allow **TCP port 3002**.
2. Open in browser: `http://76.13.195.111:3002`

If you use Nginx manually, add a server block that proxies to 3002:

```nginx
server {
    listen 80;
    server_name studio.yourdomain.com;   # or use default_server for IP access
    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Reload Nginx after editing.

---

## 5. Useful PM2 commands (on VPS)

```bash
pm2 status              # list apps
pm2 logs studio-social   # logs
pm2 restart studio-social
pm2 stop studio-social
```

---

## 6. Redeploy after code changes

From your Mac (if using rsync):

```bash
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  ./ YOUR_USER@76.13.195.111:/www/wwwroot/studio-social/
```

On VPS:

```bash
cd /www/wwwroot/studio-social
npm ci
npm run build
pm2 restart studio-social
```

If you use Git on the server:

```bash
cd /www/wwwroot/studio-social
git pull
npm ci
npm run build
pm2 restart studio-social
```

---

## Checklist

- [ ] Node.js 18+ on VPS  
- [ ] Project at `/www/wwwroot/studio-social` (or your path)  
- [ ] `.env.production` with Supabase + OpenAI keys  
- [ ] `npm run build` succeeds  
- [ ] PM2 running on port 3002, `curl http://127.0.0.1:3002` OK  
- [ ] aaPanel: reverse proxy to `http://127.0.0.1:3002` **or** firewall allows 3002  
- [ ] Open `http://76.13.195.111:3002` or your domain in the browser  
