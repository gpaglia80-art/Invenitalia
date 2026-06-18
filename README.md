# InvenItalia

React PWA covering all ~7,913 Italian comuni — live weather (Open-Meteo), attractions,
transport, and bilingual (IT/EN) Wikipedia-grounded fun facts. Single-file React app
bundled with esbuild, deployed on Cloudflare Pages.

## Project layout

```
src/
  App.jsx      ← the whole app (UI, data, i18n, weather, fun facts)
  main.jsx     ← entry point: mounts React + registers the service worker
static/        ← copied verbatim into dist/ at build time
  index.html   manifest.json  sw.js  privacy.html
  _headers     _redirects     icons/  .well-known/assetlinks.json
build.mjs      ← esbuild build: bundles src → dist/assets/bundle.js, copies static/
package.json
```

## Build locally

```bash
npm install      # pulls react, react-dom, esbuild
npm run build    # outputs everything to dist/
```

The deployable site is the **`dist/`** folder.

## Deploy with GitHub → Cloudflare Pages (CI/CD)

This sets up automatic builds: every push to GitHub triggers a Cloudflare build & deploy.

1. **Create a GitHub repo** and push this project:
   ```bash
   git init
   git add .
   git commit -m "InvenItalia source"
   git branch -M main
   git remote add origin https://github.com/<you>/invenitalia.git
   git push -u origin main
   ```
2. **Cloudflare dashboard** → Workers & Pages → **Create** → **Pages** → **Connect to Git**.
3. Select your repo, then set **Build settings**:
   - Framework preset: **None**
   - Build command: **`npm run build`**
   - Build output directory: **`dist`**
4. **Save and Deploy.** Cloudflare runs the build and serves `dist/` at a `*.pages.dev` URL.

> **Important:** create this as a **new project** (e.g. `invenitalia-next`) so your existing
> `invenitalia4.pages.dev` production deploy and the Play Store TWA stay untouched while you
> verify. Once you're happy, you can switch the TWA / production over.

Future changes: edit `src/App.jsx`, commit, push → Cloudflare rebuilds automatically.

## Notes on this rebuild

- Reconstructed from the live build after the original source was lost. The UI strings,
  branding, Open-Meteo weather (+ 7-day forecast), and Wikipedia fun-facts logic were
  recovered from the deployed bundle; the comuni data and styles are from the last `.jsx`.
- `assetlinks.json` carries the existing Play app fingerprint (`com.invenitalia.app`).
- The service worker (v5) is network-first for Open-Meteo / Wikipedia and never caches
  navigations.
- **Tours / Itineraries** is the planned next addition (a 4th tab) — not yet included here.
