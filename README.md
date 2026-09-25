# hennch.co

Personal website of Cornelius Hennch, built with [Quarto](https://quarto.org) and deployed on Netlify.

## Workflow

- `quarto preview` shows a live preview while editing.
- New posts go in `post/<slug>/index.qmd`. The folder name becomes the URL (`/post/<slug>/`).
- Posts with R code: run `quarto render` locally and commit the `_freeze/` folder. Netlify can't run R, so it reuses the frozen results.
- Push to `master`. Netlify renders the site with `@quarto/netlify-plugin-quarto` and publishes `_site/`.

## Layout

- `index.qmd`: homepage (profile, publications, recent posts, contact form)
- `post/`, `publication/`: one folder per entry
- `privacy/`, `terms/`: Impressum and license
- `_redirects`: keeps the URLs of the old Hugo site working
