# MD Salman Sazid — Portfolio

A hand-coded, fully responsive personal portfolio. No frameworks, no build step — pure HTML, CSS and JavaScript, served straight from GitHub Pages.

**Live site:** https://salman-sazid-007.github.io/portfolio/

## Design

A strict **dual-tone** system: one amber accent (`#f0a03c`) on a slate base (`#1b2030` → `#333b53`). No gradients, no rainbow accents, no monograms — the photograph carries the identity.

- Deep slate hero with a large portrait block and amber rule
- Numbered section labels (`01 — About`) with rule prefixes
- 1px hairline dividers instead of drop-shadowed cards
- Sharp 4px radii, uppercase micro-labels, generous type scale
- Light theme inverts onto warm off-white (`#f6f4f0`) with a deeper amber for AA contrast

## Motion

Deliberate and restrained — nothing that competes with the content:

- Scroll reveals with staggered delays
- Count-up statistics that always settle on the true value
- Typing role line, drawing chart, animated skill bars
- Magnetic buttons and a hairline scroll-progress bar

Fully honours `prefers-reduced-motion`, with a `noscript` fallback for visitors without JavaScript.

## Sections

Hero · Tools · About & stats · Experience timeline · Selected work · Capabilities · Contact

## Structure

```
index.html                     # single page
assets/css/style.css           # tokens, layout, animation
assets/js/main.js              # theme, reveals, counters, form
assets/img/portrait.jpg|webp   # hero portrait (4:5)
assets/files/…-CV.pdf          # downloadable CV
```

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Personalising

- **Photo** — replace `assets/img/portrait.jpg` and `portrait.webp` (4:5 crop works best)
- **CV** — replace `assets/files/Md-Salman-Sazid-CV.pdf`
- **Colours** — the accent lives in `--amber` / `--accent` at the top of `assets/css/style.css`

Deploys are automatic: a workflow validates the JS and publishes `main` to `gh-pages` on every push.

---

© MD Salman Sazid · Rajshahi, Bangladesh
