# Warm edition

The third design, served at **/warm/**. The amber edition at the root and the editorial edition at `/editorial/` are both untouched — this folder is self-contained.

**Live:** https://salman-sazid-007.github.io/portfolio/warm/

## Design

Warm cream and sand, lit by an amber radial halo behind the portrait.

| Token | Value |
|---|---|
| Cream | `#fdf8ef` |
| Sand | `#efe1cb` |
| Ink | `#12100e` |
| Amber | `#f5a524` |
| Amber deep | `#e0841f` |

**The signature move** is the split headline: `Hey,` and `there` sit either side of the portrait, which is layered between them, so the italic serif words frame the face. Below, `I AM` / `SALMAN` is set in heavy condensed Anton and overlaps the bottom of the photo, with the role stacked to the right.

- Wordmark in italic serif (`Salman.`) against Anton display type
- Filled black pill for the Contact button
- Ghosted outline numerals (01–04) for the service row
- The workstation block is a **CSS-built phone composition**, not stock photography

## Type

- **Anton** — heavy condensed uppercase display
- **Instrument Serif** italic — accents and the `Hey, there` headline
- **Archivo** — body and UI

## The cut-out

`assets/img/salman-cutout.png` is a colour alpha cut-out built with OpenCV:
GrabCut → connected-component cleanup → hole filling → row-wise torso fill →
edge de-fringing → inpaint of background bleed.

Served as PNG with a 155 KB WebP first, plus a 560 px variant for phones.

## Structure

```
index.html                    # single page
assets/css/warm.css           # warm system
assets/js/warm.js             # reveals, counters, anchors
assets/img/salman-cutout.*    # colour cut-out (PNG + WebP + @sm)
```

## Notes

- Deploys automatically with the rest of the site (workflow publishes `main` to `gh-pages`)
- Counters settle on true values in every context — reduced motion, hidden tab, no rAF
- Print styles included; content works without JS
