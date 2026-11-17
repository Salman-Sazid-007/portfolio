# MD Salman Sazid — Portfolio

A hand-coded, fully responsive personal portfolio. No frameworks, no build step — pure HTML, CSS and JavaScript, served straight from GitHub Pages.

**Live site:** https://salman-sazid-007.github.io/portfolio/

## Highlights

- **Dual theme** — polished dark and light palettes with a smooth toggle that remembers your choice
- **Motion with purpose** — scroll reveals, animated counters, typewriter headline, drawing charts, magnetic buttons, 3D card tilt and a canvas particle field that reacts to the cursor
- **Fully responsive** — from 320 px phones to ultra-wide desktops, with a dedicated slide-down mobile menu
- **Accessible** — semantic landmarks, keyboard focus rings, `aria` labels, alt text and full `prefers-reduced-motion` support
- **Dependency-free** — one stylesheet (16 KB gzipped) and one script; only the Google Fonts link is remote
- **Print ready** — prints to a clean, single-column CV

## Sections

Hero · About · Experience & Education timeline · Selected work (filterable) · Skills · Contact

## Structure

```
index.html                  # single page
assets/css/style.css        # design tokens, layout, animation
assets/js/main.js           # theme, reveals, particles, form, cursor
assets/img/profile.svg      # monogram avatar
assets/files/…-CV.pdf       # downloadable CV
```

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Personalising

- Swap `assets/img/profile.svg` for your own photo (`<img class="avatar">` in `index.html`)
- Replace `assets/files/Md-Salman-Sazid-CV.pdf` with an updated CV
- Theme colours live in the `:root` / `[data-theme]` blocks of `assets/css/style.css`

---

© MD Salman Sazid · Rajshahi, Bangladesh
