# Plugsquire website

Static marketing site for Plugsquire, a native macOS app that lists every device connected to a Mac and audits it for problems.

Live at https://plugsquire.luongnv.com/

## Pages

| File | Page |
|------|------|
| `index.html` | Landing page |
| `privacy.html` | Privacy policy |
| `terms.html` | Terms of use |
| `changelog.html` | Release notes |
| `docs.html` | Getting started |

Shared styles live in `css/style.css`; the logo and favicon in `assets/`.

## Rules for this site

- No third-party requests: no analytics, cookies, web fonts, CDNs or external scripts. No JavaScript.
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
