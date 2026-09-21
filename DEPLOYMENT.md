# 5am.earth - Deployment Guide

This is a Next.js site with a built-in admin/CMS panel. Content (text, colors,
images, typography, use cases, team members) is stored in a JSON file and
uploaded images on the server's disk - **there is no database**.

Read the "Important: this needs a real server" section before you start -
it is not compatible with serverless hosts like Vercel/Netlify without changes.

---

## 1. Requirements

- **Node.js 18.18 or newer** (Node 20 LTS recommended). Check with `node -v`.
- A server with a **persistent filesystem** - a VPS, dedicated box, or any
  host where the disk survives between requests and deploys (see section 6).
- Ability to run a long-lived Node process (directly, via `pm2`, `systemd`,
  a Docker container, etc.) and expose it through a reverse proxy (nginx/
  Caddy/Apache) for HTTPS on your domain.
- Outbound access not required. No external API keys, no database service.

---

## 2. What to upload

Upload the whole project folder **except**:

| Skip this              | Why                                            |
| ---------------------- | ---------------------------------------------- |
| `node_modules/`        | Reinstalled on the server with `npm install`   |
| `.next/`               | Build output, regenerated with `npm run build` |
| `tsconfig.tsbuildinfo` | Local TypeScript cache, not needed             |

Everything else - `app/`, `components/`, `lib/`, `public/`, `content/`,
`middleware.ts`, `next.config.mjs`, `next-env.d.ts`, `package.json`,
`package-lock.json`, `tsconfig.json` - should go up.

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

Then start it. **Set a real admin password** - don't run with the default:

```bash
ADMIN_PASSWORD="choose-a-strong-password" npm run start
```

By default this starts the app on **port 3300**. `npm run start` runs
`next start -p 3300` - change the port in `package.json` if you need a
different one, or put a reverse proxy in front of it (recommended either way).

### Keeping it running

Don't just leave `npm run start` in a terminal - it'll die when the session
closes. Use a process manager instead. With `pm2`:

```bash
npm install -g pm2
ADMIN_PASSWORD="choose-a-strong-password" pm2 start npm --name 5am-earth -- run start
pm2 save
pm2 startup   # follow the printed instructions to enable on-boot start
```

Or a `systemd` service - ask your IT person's preferred method; either works
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

- `content/site.json` - all text, colors, layout settings, use cases, team members
- `public/uploads/` - every image uploaded through the admin panel

**Whenever you deploy a code update later, do not replace these two paths**
with older copies from your local machine or repo. Only sync code changes
(`app/`, `components/`, `lib/`, etc.) - leave `content/site.json` and
`public/uploads/` alone on the server, or you'll wipe out live edits made
through the admin.

Recommended: set up a simple cron job or manual habit to back up those two
paths regularly (e.g. `tar -czf backup-$(date +%F).tar.gz content/site.json public/uploads/`).

If `content/site.json` is ever missing, the site will auto-create it with
default placeholder content on first request - so losing it doesn't break
the site, but it does lose all edits made in the admin.

---

## 6. Important: this needs a real server, not serverless hosting

This app reads and writes `content/site.json` and `public/uploads/` directly
on disk at request time. That **will not work** on serverless/edge platforms

- **Vercel, Netlify, Cloudflare Pages/Workers** - because their filesystems
  are read-only or reset on every deploy/cold start. Content edits and
  uploaded images would silently disappear.

It works fine on:

- A VPS (DigitalOcean, Hetzner, Linode, AWS EC2, etc.)
- A dedicated/shared server with Node.js support
- A Docker container **as long as `content/` and `public/uploads/` are
  mounted as a persistent volume**, not baked into the image
- Platforms with a persistent disk option (Railway with a volume, Render
  with a disk, etc.)

Run it as **one single Node process** - don't scale it to multiple replicas
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

---

## 8. Where the contact email addresses live

There are **two separate** addresses, and they are deliberately different.
Changing one does not change the other, and they live in different places:

| What                                         | Address             | Set where                                 |
| -------------------------------------------- | ------------------- | ----------------------------------------- |
| The `mailto:` links (footer, contact page)   | **info@5am.earth**  | `content/site.json` in this repo - see 8a |
| Where contact-form submissions are delivered | **yoram@5am.earth** | inside the Google Apps Script - see 8b    |

This split is intentional: the site shows a public inbox, while form
submissions route to Yoram. Do not "fix" one to match the other.

### 8a. The address shown in the footer - in this repo

`content/site.json` → `settings.contactEmail` (currently `info@5am.earth`).
`settings.contactEmailLabel` overrides the text shown; it is empty, so the
address itself is displayed.
Rendered by `components/SiteFooter.tsx` as a `mailto:` link. Setting it to an
empty string hides the link. The default, used when the key is missing, is in
`lib/content.ts` → `defaultContent().settings.contactEmail`.

### 8b. Who the contact form emails - `yoram@5am.earth`, NOT in this repo

`components/ContactForm.tsx` POSTs to a Google Apps Script web app:

```
https://script.google.com/macros/s/AKfycbzIDQm.../exec
```

The recipient is hard-coded **inside that Apps Script project**, server-side.
Nothing in this repo can change it - editing the site will not redirect where
form submissions land. To change it:

1. Open <https://script.google.com> with the Google account that owns the script.
2. Open the project behind the `/exec` URL above.
3. In `Code.gs`, set the recipient passed to `MailApp.sendEmail(...)` /
   `GmailApp.sendEmail(...)` to **`yoram@5am.earth`**. This stays Yoram even
   though the visible `mailto:` links are `info@5am.earth` - see the table
   above.
4. **Deploy → Manage deployments → edit the active deployment → Deploy.**
   Editing the code alone does nothing until it is redeployed; a _new_
   deployment produces a new `/exec` URL, which would also have to be updated
   in `ContactForm.tsx`. Editing the existing deployment keeps the URL stable.
5. Submit the live form once and confirm the mail arrives.

Because the fetch uses `mode: 'no-cors'`, the browser cannot read the response

- the page shows "Message sent!" as soon as the request leaves. A misconfigured
  or undeployed script therefore fails **silently**. Step 5 is the only real test.

### What the script actually does (probed from outside, 2026-09-18)

The deployment is live and publicly reachable. `GET /exec` is a health check
returning `{"ok":true,"info":"5am.earth contact endpoint"}`. `doPost` returns
JSON via the usual Apps Script 302 → `script.googleusercontent.com/macros/echo`
redirect, so `curl` can read replies the browser cannot.

Probing with payloads that deliberately trip each guard shows this order -
**both anti-spam signals are implemented**, and both short-circuit _before_
field validation, returning a silent success so bots learn nothing:

| #   | Check                                   | Response                                           |
| --- | --------------------------------------- | -------------------------------------------------- |
| 1   | `JSON.parse` of the body                | `{"ok":false,"error":"Server error"}`              |
| 2   | honeypot `website` non-empty ⇒ **drop** | `{"ok":true}`                                      |
| 3   | `elapsedMs` too small ⇒ **drop**        | `{"ok":true}`                                      |
| 4   | required fields missing                 | `{"ok":false,"error":"Missing or invalid fields"}` |
| 5   | send mail                               | `{"ok":true}`                                      |

Proof that step 2 really drops: `{}` with an empty `website` returns the
step-4 validation error, but `{}` with `website` filled returns `{"ok":true}`.
The honeypot field alone changes the outcome, so it must short-circuit first.
Same argument for step 3 using `elapsedMs`.

Consequence for testing: a submission with the honeypot filled, **or** with a
tiny `elapsedMs`, is guaranteed not to email anyone - that is the safe way to
probe this endpoint without spamming the recipient. Steps 2, 3 and 5 all
return an identical `{"ok":true}`, so a success response is **not** evidence
that mail was sent.

**Still unverifiable from outside:** the recipient address, and whether step 5
actually delivers. Both need the Apps Script project open.

**Check while you are in `Code.gs`:** whether `role` is in the step-4 required
fields list. The form's `<select>` starts at `value=""` and is not `required`,
so `role` can legitimately arrive empty; if the script requires it, those
submissions are rejected at step 4 while the page still says "Message sent!".

### Forms that are not wired up

Two forms are placeholders and submit nowhere - they are not connected to
the Apps Script or any CRM:

- `components/DemoModal.tsx` - the "See it in action" modal (`type="button"`,
  no handler; its own caption says "Connect this action to the CRM before launch")
- `app/page.tsx` - the home page lead form in the green section ("Wireframe form")

Only `/contact` actually delivers anything today.

---

## 9. Images: run the optimizer before committing

`next.config.mjs` uses `output: "export"` with a **custom image loader**
(`lib/imageLoader.ts`), so Next.js does **no** image optimization of its own -
whatever byte-for-byte sits in `public/` is what the browser downloads. Two
things therefore have to be prepared ahead of time, and one script does both:

```bash
python3 scripts/optimize-images.py     # needs Pillow; --force redoes everything
```

1. **PNG to WebP.** The collages are large-canvas artwork. As PNG they ran
   ~2 MB each, which made `/process` a 4.8 MB page. At WebP q=82 they are
   ~150 KB with no visible difference.

2. **A width ladder** (`name-420w.webp`, `-640w`, `-828w`, `-1280w`, each
   capped at the source width so a variant is never an upscale).
   `lib/imageLoader.ts` maps the width next/image asks for onto one of these,
   which is what makes the emitted `srcset` real - without it every viewport
   downloads the largest file. A phone now pulls ~17 KB for the home hero
   instead of ~112 KB.

Three places have to agree, or `srcset` will point at files that do not exist.
If you change one, change all three:

| Ladder lives in                           | What it controls                      |
| ----------------------------------------- | ------------------------------------- |
| `scripts/optimize-images.py` -> `LADDER`  | which files get generated             |
| `lib/imageLoader.ts` -> `LADDER`          | which file a requested width maps to  |
| `next.config.mjs` -> `images.deviceSizes` | which widths Next may put in `srcset` |

**Adding a new image:** drop it in `public/uploads/`, run the script, then
point the reference at the plain `.webp` (in `content/site.json`, or the
fallback `src` in the page component) - _not_ at a `-640w` variant, the loader
adds that. Give the `<Image>` a `sizes` prop from `lib/imageSizes.ts`
(`SIZES_FULL` for a full-width figure, `SIZES_HALF` for one side of a
two-column grid). Without `sizes`, next/image falls back to a 1x/2x srcset and
the ladder is wasted.

The original PNGs are kept in `public/` so that any stale `/uploads/*.png`
path still resolves; they are simply no longer referenced.

---

## 10. The font is served as WOFF2

`public/fonts/` holds both `Manrope-VariableFont_wght.woff2` (54 KB) and the
original `.ttf` (163 KB). The `@font-face` in `app/globals.css` lists woff2
first, so only pre-2016 browsers ever fetch the TTF. The WOFF2 keeps all 740
glyphs and the full `wght 200-800` axis - it is a re-compression, not a subset.

`app/layout.tsx` also preloads it. Without that the font sits third in the
critical chain (html, then css, then font) and delays first paint.

To regenerate after replacing the TTF, with `fonttools` and `brotli`
installed, load the TTF in fontTools, set `flavor = "woff2"` and save it
alongside the original.

---

## 11. Headline sizes must stay viewport-relative

Headings size off `--tp-headline-size` (set from `content/site.json`) through a
`clamp()`. The middle term of that clamp has to be viewport-relative or the
clamp does nothing: `clamp(48px, 92px, 160px)` is just `92px` at every width.
That is what pushed the home hero 227 px past a 412 px phone viewport - the
word "Opportunities." rendered 610 px wide and dragged the whole hero grid,
body copy and buttons with it, so the page scrolled sideways.

`.hero h1` now uses `clamp(34px, 13vw, var(--tp-headline-size, 92px))`, which
still reaches the CMS-configured size from ~710 px up. The section headings
(`.section-head h2`, `.case-grid h2`, `.final-cta h2`, `.inner-hero h1`, ...)
get vw-based sizes below 560 px for the same reason.

If you change a headline size in the admin panel, re-check the narrow widths.

---

## 12. Measuring performance - use the built site, not `npm run dev`

Running Lighthouse against `npm run dev` measures React's development build:
unminified bundles, the hot-reload client and the dev overlay. It reported
900 ms of blocking time and a 1.8 MB page for a site that actually ships 0 ms
and ~550 KB. Always measure the export instead.

How you serve `out/` depends on which environment you built (see §14):

```bash
# production build (no basePath) - serve out/ directly
npm run build
cd out && python3 -m http.server 8100          # -> http://127.0.0.1:8100/

# staging build (basePath) - out/ must sit under a matching directory name
NEXT_PUBLIC_BASE_PATH=/5am.earth-staging npm run build
mkdir -p /tmp/preview && ln -sfn "$PWD/out" /tmp/preview/5am.earth-staging
cd /tmp/preview && python3 -m http.server 8099 # -> .../5am.earth-staging/
```

**Do not run `npm run build` while `npm run dev` is running.** Both write to
`.next`, so the build pulls the chunks out from under the dev server and every
request starts failing with `Error: Cannot find module './948.js'`
(`MODULE_NOT_FOUND`, stack pointing at `.next/server/webpack-runtime.js`). The
code is fine; the dev server's cache is not. Recover with:

```bash
# stop the dev server, then
rm -rf .next && npm run dev
```

Two flags in that local run are artifacts of `python -m http.server` and do
**not** apply to GitHub Pages, which was checked directly with `curl -I`:

- _"Enable text compression"_ - Pages returns `content-encoding: gzip`.
- _"Serve static assets with an efficient cache policy"_ - Pages returns
  `cache-control: max-age=600` and gives you no way to configure it. Real, but
  unfixable short of moving to a host or CDN you control.

## 13. Standalone HTML pages (unlisted routes)

Anything dropped in `public/` is copied into `out/` byte-for-byte by
`next build`, and the Pages workflow uploads all of `out/`. So a hand-authored
HTML file becomes a public URL with no routing work and no Next involvement:

```
public/<name>.html  ->  <site root>/<name>.html
```

Currently live this way:

| File                                     | Production URL                                      | Notes                                                                                                                         |
| ---------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `public/5am-earth-editorial-design.html` | `https://5am.earth/5am-earth-editorial-design.html` | Donor Briefing 2026. 6.1 MB.                                                                                                  |
| `public/cardano-proposal.html`           | `https://5am.earth/cardano-proposal.html`           | Cardano proposal. Predates the Next site; carried over from the `archive-2026-09-21` branch so the URL keeps working. 0.5 MB. |
| `public/cardano-proposal-ja.html`        | `https://5am.earth/cardano-proposal-ja.html`        | Japanese translation of the above. 0.5 MB.                                                                                    |

All three are self-contained - fonts and artwork are inline base64, so they
have no asset dependencies and nothing in `public/` needs to travel with them.

The same files are served from the staging root too, e.g.
`https://aiquant-tech.github.io/5am.earth-staging/cardano-proposal.html`.
**Keep them in both repos.** Promotion (§14) copies the staging tree over
production, so anything that exists only in the production repo is deleted the
next time the site is promoted.

Points worth knowing:

- **It is unlisted, not private.** Nothing in the site links to it and there is
  no sitemap, so it is only reachable by someone who has the URL - but anyone
  with the URL can open it, and a search engine will index it if the link is
  ever posted somewhere public. If it needs to stay out of search results, add
  `<meta name="robots" content="noindex">` to its `<head>`.
- **`trailingSlash: true` does not apply.** That setting shapes Next's own
  generated routes; a file in `public/` is served at its exact filename, with
  no trailing slash and no directory form.
- **Keep the filename URL-safe** (lowercase, hyphens, no spaces) - it becomes
  the public path verbatim.
- **Do not give it a name that collides with a route.** `public/contact.html`
  and the `/contact/` page would both want the same area of the URL space.

## 14. Two environments, one codebase

The same source deploys to both sites. The only difference is one environment
variable, because GitHub Pages serves them from different roots:

|            | Repo                             | Served at                                           | `NEXT_PUBLIC_BASE_PATH` |
| ---------- | -------------------------------- | --------------------------------------------------- | ----------------------- |
| Production | `AIQUANT-Tech/5am.earth`         | `https://5am.earth/`                                | _unset_ (root)          |
| Staging    | `AIQUANT-Tech/5am.earth-staging` | `https://aiquant-tech.github.io/5am.earth-staging/` | `/5am.earth-staging`    |

It is read in exactly two places, and they must agree:

- `next.config.mjs` - sets `basePath` and `assetPrefix` for everything Next
  generates (routes, `_next/` assets, `<Link>` hrefs).
- `lib/imageLoader.ts` - sets `BASE_PATH` for the custom image loader and the
  `asset()` helper, which raw `<img>` tags and the `@font-face` rule use.

The `NEXT_PUBLIC_` prefix is required: `lib/imageLoader.ts` runs in the
browser, so the value has to be inlined at build time.

**Do not put a basePath-dependent URL in `app/globals.css`.** Next copies
`url()` values into the built stylesheet verbatim - it does not rewrite them
with `basePath` - so a literal path there is correct in one environment and
broken in the other. That is why the `@font-face` rule is generated by
`fontFaceCss()` in `lib/content.ts` and injected as an inline `<style>` by
`app/layout.tsx`. The same rule applies to any future CSS that needs to point
at something in `public/`.

### Promoting staging to production

Staging is the working repo; production receives finished work. To promote:

1. Copy the staging tree over the production repo, excluding `.git`,
   `node_modules`, `.next`, `out` and `tsconfig.tsbuildinfo`.
2. Keep production's own `.github/workflows/pages.yml` - it is the same file
   minus the `NEXT_PUBLIC_BASE_PATH` env on the build step.
3. Build with no env var and confirm `grep -r "5am.earth-staging" out/` finds
   nothing before committing.

The previous hand-written production site is preserved on the
`archive-2026-09-21` branch of the production repo: `index.html`, `hero.mp4`,
`logo.png`, the `_hero_*` / `_vcr_*` working PNGs, `bin/act` and
`local-server.py`. None of those are live.

The two cardano proposal pages were on that branch too and **have been brought
back** into `public/` in both repos, because they were already published URLs
that people hold links to. To recover anything else from the archive:

```bash
git show archive-2026-09-21:<file> > public/<file>
```

Use `git show >` rather than `git checkout <branch> -- <file>`, which would
stage the file at its old root path instead of under `public/`.
