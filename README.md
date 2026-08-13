# mako.log

A small, static personal site for **mako** (真) — *makostrwlkr* around the
internet. Notes, a blog, a resources listing, and full client-side search.
No build step, no backend, no database. Deployable as-is to GitHub Pages (or
any static host).

Design shares the identity of the Twitch overlays: teal + white with a
fuchsia/magenta accent, sumi ink on washi paper, a shogi-*koma* motif, and
LaTeX-source framing (`\begin{...}`, `\qed`, `%` comments). Math is typeset
with **KaTeX** (from a CDN).

## File structure

```
index.html          Homepage — hero, browse-by-topic koma, recent activity
about.html          Bio, interests, contact
resources.html      Downloadable files (listing)
search.html         Full search (client-side, in-browser)
search-index.json   Search manifest — one entry per note / post / resource
notes/
  index.html        List of all notes
  example-note.html Copy this to make a new note
  *.html            One file per note
blog/
  index.html        List of all posts
  example-post.html Copy this to make a new post
  *.html            One file per post
resources/
  *.pdf, *.py       Downloadable files
assets/
  css/main.css      All styling (design tokens at the top)
  js/search.js      Search engine (fetches search-index.json)
  img/photo-1.jpg   Hero seal (default)
  img/photo-2.jpg   Hero seal (hover / focus swap)
```

## Running it locally

The site is multiple files that reference each other (and search fetches
`search-index.json`), so open it through a **server**, not by double-clicking:

```
cd site
python3 -m http.server 8000
# then visit http://localhost:8000
```

A bare `file://` will break search and some links — normal for any multi-file
static site.

## Deploying to GitHub Pages

Put the contents of `site/` at the repo root (or `/docs`), then
**Settings → Pages** → deploy from that branch/folder. A `.nojekyll` file is
included so Pages serves the files as-is. Relative links work under a project
subpath (`user.github.io/repo/`).

## Adding a note or blog post

1. **Copy the template**: `notes/example-note.html` → `notes/your-slug.html`
   (or `blog/example-post.html` → `blog/your-slug.html`).
2. **Edit** the title, date, category, tags, and prose. Inline math is
   `$…$`; display math is `$$…$$`. Callout boxes use `.box`, `.box.def`, or
   `.box.thm` and read like LaTeX environments.
3. **List it** on the section index (`notes/index.html` or `blog/index.html`)
   by copying an existing `<article class="card">…</article>` block.
4. **Index it for search**: add an entry to `search-index.json`:

   ```json
   {
     "title": "Your title",
     "url": "notes/your-slug.html",
     "type": "note",
     "cat": "math",
     "date": "2026-08-01",
     "tags": ["combinatorics"],
     "excerpt": "One-line summary shown in results.",
     "text": "Longer plain-text body used only for matching."
   }
   ```

   `type` is `note`, `post`, or `resource`; `cat` is one of the koma keys:
   `shogi, gaming, anime, netslang, math, quantum, security`.

The homepage "browse by topic" koma link to `search.html?cat=<key>`, so a new
post shows up there automatically once its category is set.

## Adding a resource

Drop the file in `resources/`, add a row to `resources.html`, and add a
`"type": "resource"` entry to `search-index.json`.

## Math typesetting

Every page loads KaTeX from cdnjs and auto-renders `$…$` / `$$…$$`. To pin a
version or go offline, download `katex.min.css`, `katex.min.js`, and
`contrib/auto-render.min.js`, drop them in `assets/`, and repoint the three
tags in each page's `<head>`.

## Reskinning

All colours and fonts are CSS variables at the top of `assets/css/main.css`
(`--teal`, `--fuchsia`, `--paper`, …). Change them there and the whole site
follows. The koma set lives in `assets/js/search.js`.
