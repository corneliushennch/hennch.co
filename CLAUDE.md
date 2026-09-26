# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal website of Cornelius Hennch (https://www.hennch.co): a Quarto website, migrated from blogdown/Hugo (Wowchemy) in September 2026. There are no tests or linters. A clean `quarto render` is the check.

## Commands

- `quarto preview`: live preview with reload. Restart it after adding a new page or changing `_quarto.yml`. A running preview only re-renders files it already knows.
- `quarto render`: full build into `_site/` (gitignored).
- `quarto render post/<slug>/index.qmd`: render a single page.

## Build and deploy

- Netlify builds on push. `netlify.toml` loads `@quarto/netlify-plugin-quarto` (declared in `package.json`), which installs Quarto and runs `quarto render`. `_site/` is published.
- The Netlify dashboard's **Build command must stay empty**. `netlify.toml` sets no command, so a dashboard value would override the plugin.
- Netlify cannot run R. `execute: freeze: auto` is set. Any page with executable code must be rendered locally and its `_freeze/` output committed. Currently no page executes code: the karyoploteR post shows its R code as plain ```` ```r ```` blocks plus a pre-rendered PNG.
- `_redirects` is copied into `_site` via `resources` and keeps the URLs of the old Hugo site working (tags, taxonomies, removed demo pages, `/index.xml` → `/post/index.xml`).

## Structure and conventions

- **Render list is explicit.** `project.render` in `_quarto.yml` lists what gets rendered, so stray `.md` files such as `README.md`, `LICENSE.md` and this file never become pages. A new top-level page folder, such as `datenschutz/`, must be added there. Non-linked files (PDFs, `cite.bib`, fonts, favicons) must be matched by `project.resources`, or they won't be copied into `_site`.
- **Page URLs are folder-based.** Every page is `<folder>/index.qmd`, which gives the trailing-slash URLs of the old site: `/post/<slug>/`, `/publication/<name>/`, `/privacy/` (the Impressum), `/datenschutz/`, `/terms/`. Keep this pattern for new pages.
- **Homepage (`index.qmd`)** is a single page. It holds a hand-written profile grid (`#about`), two embedded listings (`#featured-publications` and `#recent-posts`), and a raw-HTML Netlify contact form (`data-netlify="true"`, section `#contact`). The navbar items are anchors into it (`index.qmd#featured`, `#posts`, `#contact`).
- **Publications** are `publication/<name>/index.qmd` plus a `cite.bib`. The fields that matter are:
  - `author` (list; "Cornelius Hennch" is bolded by the template)
  - `author-notes` (N entries put an equal-contribution `*` on the first N authors)
  - `venue` (journal)
  - `doi` (bare, without `https://doi.org/`)
  - `pdf` (optional)
  - `categories`, `abstract`

  Don't use `journal`: it's a reserved Quarto field and fails validation. `_templates/publications.ejs` renders both the homepage listing and `/publication/`. Its HTML output lines must not be indented, or pandoc turns them into code blocks. It works out links from `item.path`, which ends in `index.qmd`.
- **Posts** are `post/<slug>/index.qmd`. `post/_metadata.yml` supplies author and license (CC BY-NC). `post/index.qmd` is the full listing with categories and the RSS feed (`/post/index.xml`). Set `image:` explicitly for a listing thumbnail.

## Styling

- Theme: Bootswatch `sandstone` in both modes. **Dark is the default** (listed first under `theme:`), and a light/dark toggle is enabled.
- `dark.scss` holds only the dark palette (sandstone-derived warm greys; off-white text `#f8f5f0`; links `#2399cc`, chosen to keep WCAG AA contrast on `#272824`).
- `light.scss` holds only light-mode overrides (link green `#3d6b27`, matched to the headshot background; 6.3:1 on white instead of sandstone's 2:1 `#93c54b`).
- `styles.scss` is shared by both modes: fonts, and layout rules for `.home`, `.profile`, `.pub-list` and the contact form. Keep Sass variables declared as `$name: value`, with a space after the colon, or Quarto warns "variable used before declaration".
- Fonts: Source Serif 4 (body text inside `main.content`), Inter (headings, navbar, buttons, publication list, profile, forms) and JetBrains Mono (code), all via `@font-face` from `assets/fonts/`. `$web-font-path: false` stops sandstone importing Roboto.

## Privacy constraints (German site)

The site deliberately makes **no third-party requests and sets no cookies**:
- Fonts and Font Awesome are self-hosted (`assets/`). Font Awesome's CSS is linked in `_includes/header.html`.
- MathJax is disabled (`html-math-method: plain`).
- Google Analytics and the cookie banner were removed on purpose, because the owner doesn't want tracking.

Don't add CDN links, Google Fonts, analytics or embeds without asking. If one is added, `datenschutz/index.qmd` (German privacy note) must be updated to match. `privacy/index.qmd` is the Impressum and keeps that URL for backward compatibility.

## Local environment gotcha

In the Claude Code sandbox, `~/Library/Caches/quarto` isn't writable. Run renders as `HOME=$TMPDIR/home quarto render`. The sandbox also denies reads of a `./data` directory, so don't create one. And it blocks Deno and `gh` from reaching the system certificates, so `quarto add` and `gh` need the sandbox disabled.
