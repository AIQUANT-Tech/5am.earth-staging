# 5am.earth — Deployment Guide

This is a Next.js site with a built-in admin/CMS panel. Content (text, colors,
images, typography, use cases, team members) is stored in a JSON file and
uploaded images on the server's disk — **there is no database**.

Read the "Important: this needs a real server" section before you start —
it is not compatible with serverless hosts like Vercel/Netlify without changes.

---

## 1. Requirements

- **Node.js 18.18 or newer** (Node 20 LTS recommended). Check with `node -v`.
- A server with a **persistent filesystem** — a VPS, dedicated box, or any
  host where the disk survives between requests and deploys (see section 6).
- Ability to run a long-lived Node process (directly, via `pm2`, `systemd`,
  a Docker container, etc.) and expose it through a reverse proxy (nginx/
  Caddy/Apache) for HTTPS on your domain.
- Outbound access not required. No external API keys, no database service.

---

## 2. What to upload

Upload the whole project folder **except**:

| Skip this | Why |
|---|---|
| `node_modules/` | Reinstalled on the server with `npm install` |
| `.next/` | Build output, regenerated with `npm run build` |
| `tsconfig.tsbuildinfo` | Local TypeScript cache, not needed |

Everything else — `app/`, `components/`, `lib/`, `public/`, `content/`,
`middleware.ts`, `next.config.mjs`, `next-env.d.ts`, `package.json`,
`package-lock.json`, `tsconfig.json` — should go up.

Use whatever transfer method you have: `scp`/`rsync` over SSH, `git push` to
a repo the server pulls from, an FTP/SFTP client, or a hosting panel's file
manager. Zip the folder first if that's easier for a one-time upload.

---

## 3. Install and run

On the server, inside the project folder:

```bash
npm install
npm run build
```

Then start it. **Set a real admin password** — don't run with the default:

```bash
ADMIN_PASSWORD="choose-a-strong-password" npm run start
```

By default this starts the app on **port 3300**. `npm run start` runs
`next start -p 3300` — change the port in `package.json` if you need a
different one, or put a reverse proxy in front of it (recommended either way).

### Keeping it running

Don't just leave `npm run start` in a terminal — it'll die when the session
closes. Use a process manager instead. With `pm2`:

```bash
npm install -g pm2
ADMIN_PASSWORD="choose-a-strong-password" pm2 start npm --name 5am-earth -- run start
pm2 save
pm2 startup   # follow the printed instructions to enable on-boot start
```

Or a `systemd` service — ask your IT person's preferred method; either works
fine, this app has no special requirements beyond "keep one Node process
alive and restart it if it crashes."

### Reverse proxy (recommended)

Point your domain at the box, terminate HTTPS there, and proxy to
`localhost:3300`. Example nginx snippet:

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3300;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 4. The admin panel

- URL: `https://yourdomain.com/5amAdmin`
- Password: whatever you set as `ADMIN_PASSWORD` above.
- From there you can edit every page's text, colors, background, images,
  layout spacing, typography, the Use Cases list, the Team list, and show/
  hide pages from the main menu.

---

## 5. Critical: back up and never overwrite these two paths

The whole site's content lives in two places on disk, **not in git, not in
the deploy package**:

- `content/site.json` — all text, colors, layout settings, use cases, team members
- `public/uploads/` — every image uploaded through the admin panel

**Whenever you deploy a code update later, do not replace these two paths**
with older copies from your local machine or repo. Only sync code changes
(`app/`, `components/`, `lib/`, etc.) — leave `content/site.json` and
`public/uploads/` alone on the server, or you'll wipe out live edits made
through the admin.

Recommended: set up a simple cron job or manual habit to back up those two
paths regularly (e.g. `tar -czf backup-$(date +%F).tar.gz content/site.json public/uploads/`).

If `content/site.json` is ever missing, the site will auto-create it with
default placeholder content on first request — so losing it doesn't break
the site, but it does lose all edits made in the admin.

---

## 6. Important: this needs a real server, not serverless hosting

This app reads and writes `content/site.json` and `public/uploads/` directly
on disk at request time. That **will not work** on serverless/edge platforms
— **Vercel, Netlify, Cloudflare Pages/Workers** — because their filesystems
are read-only or reset on every deploy/cold start. Content edits and
uploaded images would silently disappear.

It works fine on:
- A VPS (DigitalOcean, Hetzner, Linode, AWS EC2, etc.)
- A dedicated/shared server with Node.js support
- A Docker container **as long as `content/` and `public/uploads/` are
  mounted as a persistent volume**, not baked into the image
- Platforms with a persistent disk option (Railway with a volume, Render
  with a disk, etc.)

Run it as **one single Node process** — don't scale it to multiple replicas
or use PM2 cluster mode, since two processes writing `content/site.json` at
the same time could overwrite each other's changes. One instance is correct
and sufficient for this site.

---

## 7. Quick checklist

- [ ] Node 18.18+ installed on the server
- [ ] Project uploaded (minus `node_modules/`, `.next/`)
- [ ] `npm install` && `npm run build` completed with no errors
- [ ] Started with a real `ADMIN_PASSWORD`, under pm2/systemd (not a raw terminal)
- [ ] Reverse proxy + HTTPS pointed at port 3300
- [ ] Confirmed `https://yourdomain.com` loads the site
- [ ] Confirmed `https://yourdomain.com/5amAdmin` prompts for the password and logs in
- [ ] Backup plan in place for `content/site.json` and `public/uploads/`
