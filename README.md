# Plugsquire website

Static marketing site for Plugsquire, a native macOS app that lists every device connected to a Mac and audits it for problems.

Live at https://plugsquire.luongnv.com/

## Pages

| File | Page |
|------|------|
| `index.html` | Landing page with the live demo |
| `privacy.html` | Privacy policy |
| `terms.html` | Terms of use |
| `changelog.html` | Release notes |
| `docs.html` | Getting started |

Shared styles live in `css/style.css`; the logo and favicon in `assets/`. The live demo, a simulation of the app's window with sample data, is `js/sim.js` with its styles in `css/sim.css`. Its screens and sample data follow the app's README; update both when a feature changes.

## Rules for this site

- No third-party requests: no analytics, cookies, web fonts, CDNs or external scripts. The only JavaScript is the first-party live demo (`js/sim.js`), which stores nothing; without JavaScript the page shows a screenshot instead.
- Sample data in the demo is fictional: no real network names, addresses, hosts, paths or vulnerability IDs.
- Bump the `?v=` query on the stylesheet and script links when they change, so cached copies are refreshed.
- `appcast.xml` at the root is written by the app repository's release workflow. Do not edit or delete it.
- Relative links only.
- `.nojekyll` makes GitHub Pages serve the files as they are.
- Each page's body sits inside `<!--email_off-->` … `<!--/email_off-->`, so Cloudflare (in front of luongnv.com) neither rewrites the mailto links nor injects its email-decode script.
- Text marked `[proof needed — …]` is a fact still to supply; replace it before promoting the page.

## Deploy

`.github/workflows/pages.yml` deploys the repo root to GitHub Pages on every push to `main`. The custom domain `plugsquire.luongnv.com` is a DNS-only Cloudflare CNAME to `luongnv89.github.io`.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/.
