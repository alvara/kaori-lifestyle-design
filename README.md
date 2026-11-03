# Kaori Lifestyle Design

Marketing site for Kaori Lifestyle Design (Mind × Body × Space), built with
[Astro](https://astro.build) and published to GitHub Pages. The client edits
the site's copy through [Pages CMS](https://pagescms.org), which commits to
this repo. There is no database and no server.

The design is ported, with the owner's permission, from the original Replit
draft at <https://bian-ji-kaori-lifestyle-design.replit.app/>.

## Architecture

```
 Kaori (browser)                      GitHub                         Visitors
 ───────────────                      ──────                         ────────
 app.pagescms.org  ──sign in with──▶  repo: content/*.yml
   form per page      GitHub          │
   "Save"  ─────────── commit ──────▶ main
                                      │ push triggers
                                      ▼
                                      Actions: pnpm build (Astro, static)
                                      │
                                      ▼
                                      GitHub Pages  ───────────────▶  site
```

- **Auth is GitHub.** Only accounts with write access to this repo can save
  edits. Pages CMS uses the editor's GitHub login; nothing else stores
  credentials.
- **Content is files.** Every visible string lives in `content/<lang>/<page>.yml`.
  Templates read those files at build time (`src/lib/content.ts`).
- **Deploy is a workflow.** `.github/workflows/deploy.yml` builds on every push
  to `main` and publishes `dist/` to GitHub Pages. An edit is live about a
  minute after Save.
- **Scope: copy only.** Layout, images, and styles stay in code. Developers
  change those; the client changes words.

### Why this setup

| Option considered | Verdict |
| --- | --- |
| Keystatic on Vercel | Good editor, but needs a server route and a Vercel project. Rejected to keep hosting on GitHub alone. |
| TinaCMS | Visual on-page editing, but needs Tina Cloud and a heavier build. |
| Decap / Sveltia CMS | Works on static hosting but needs a separate OAuth proxy. |
| **Pages CMS + GitHub Pages** | Chosen. Hosted editor, GitHub login, zero runtime, free. |

Trade-offs to know:

- Pages CMS is a third-party hosted app. It can be self-hosted later if needed.
- GitHub Pages is free for public repos only. Private hosting needs GitHub Pro
  or a move to another static host. The content is public anyway, so keep
  secrets out of the repo.
- Editors need a GitHub account with write access to the repo.

## Languages

English is served at `/`, Japanese at `/ja/`. The EN / JP toggle links between
the same page in each language. Each page has two content files with the same
shape: `content/en/home.yml` and `content/ja/home.yml`.

## Editing copy (for the client)

1. Go to <https://app.pagescms.org> and sign in with GitHub.
2. Open this repository.
3. Pick a page in the sidebar, for example **Home (English)** or **Home (日本語)**.
4. Change the text and press **Save**. The site updates in about a minute.

Text conventions:

- A blank line starts a new paragraph. A single line break stays a line break.
- On the Japanese home page, a paragraph written as `**Mind × Body × Space**`
  becomes the highlighted concept line.
- Fields marked *optional* hide their element when left empty.

## Development

Requires Node 22.23+ (see `.nvmrc`) and pnpm 10.

```sh
pnpm install
pnpm dev        # local preview at http://localhost:4321
pnpm build      # static output in dist/
```

To preview with the GitHub Pages sub-path: `BASE=/kaori-lifestyle-design/ pnpm build`.

### Project layout

```
content/{en,ja}/*.yml       editable copy, one file per page per language
.pages.yml                  Pages CMS form definitions (field labels, types)
src/pages/[...lang]/*.astro page templates; [...lang] is empty (EN) or "ja"
src/layouts/Base.astro      header, nav, footer, language toggle, menu script
src/lib/content.ts          YAML loader, base-path-aware links, text helpers
public/styles/site.css      compiled stylesheet from the original design
public/styles/overrides.css small fixes (language toggle uses links, not buttons)
public/images/              photos from the original design
```

### Adding a field

1. Add the key to both `content/en/<page>.yml` and `content/ja/<page>.yml`.
2. Render it in the page template.
3. Add a matching entry under that page's `fields` in `.pages.yml`. Keep the
   CMS fields and the YAML keys in sync, or the editor shows stale forms.

### Custom domain

1. Add the domain under **Settings → Pages** and a `public/CNAME` file.
2. Set repository variables `BASE_PATH=/` and `SITE_URL=https://<domain>`.

## Status

Live at <https://alvara.github.io/kaori-lifestyle-design/>. All five pages in
EN and JA are ported and match the Replit draft at 1440px and 390px. Pages CMS
config is in place and every content key has a CMS field.

Decided by the site owner (Jesse):

- Hosting is GitHub Pages only. No Vercel.
- Editing is Pages CMS with GitHub login, copy only. No database.
- The repo stays public under `alvara` for now.

## To do (later)

None of these are decided yet. Confirm the approach with Jesse before building.

- [ ] **Client access.** Kaori needs a GitHub account with write access, then a
  first sign-in at app.pagescms.org. GitHub may require two-factor login; plan
  a short call to walk her through it. Write her a one-page guide with
  screenshots.
- [ ] **Shared organization.** Proposal: move the repo into a free GitHub org
  owned by both Kaori and Jesse, so she owns her site long-term. Use
  **Settings → Transfer**. After the move, the Pages URL becomes
  `https://<org>.github.io/kaori-lifestyle-design/` unless a custom domain is
  set. The workflow derives `SITE` and `BASE` from the repo, so no code change
  is needed. Re-select the repo in Pages CMS afterward.
- [ ] **Custom domain.** Follow the *Custom domain* steps above: DNS records,
  `public/CNAME`, and the `BASE_PATH` / `SITE_URL` repo variables.
- [ ] **Contact form email.** `src/pages/[...lang]/contact.astro` renders a
  disabled form with a notice (`form.setup_note` in `content/*/contact.yml`).
  The site is static, so it needs a hosted form endpoint. Candidates:
  Formspree, Web3Forms, Basin. To ship: set the form `action` and `method`,
  enable the button, drop `onsubmit="return false"`, clear `setup_note` in both
  languages, and add a thank-you state. Keep any API key client-safe (these
  services use public form IDs).

## Notes for agents

- Use Node 22.23+ (`nvm use` reads `.nvmrc`). The default Node 20 on Jesse's
  machine fails with "Node.js v20 is not supported by Astro".
- `public/styles/site.css` is the original draft's compiled Tailwind output.
  Markup must keep the original class names, or styles break. Only utilities
  already present in that file work; check with `grep` before using a new one.
- Keep `content/en` and `content/ja` files the same shape, and keep
  `.pages.yml` fields in sync with their keys.
- Commit attribution and copy register follow the repo owner's global rules.
