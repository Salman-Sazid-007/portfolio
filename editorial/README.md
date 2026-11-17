# Editorial edition

A second, independent design served at **/editorial/**. The amber & slate design at the site root is completely untouched — this folder is self-contained.

**Live:** https://salman-sazid-007.github.io/portfolio/editorial/

## Design

Greyscale only — `#111` ink on warm off-white `#e8e8e8`. No accent colour anywhere.

- **Type as the hero:** the name is set enormous behind the portrait; the portrait (a cut-out) sits in front at a higher z-index, so the letters pass behind the head
- Thin rounded bezel framing the whole composition, with a soft drop shadow
- Split navigation: `© Salman Sazid` left, section links centred
- Vertical social rail bottom-left, stacked roles bottom-right
- Hairline rules and large numerals instead of cards and shadows
- Inter throughout, tight negative tracking

## The cut-out

`assets/img/salman-cutout-grey.png` is an alpha cut-out produced with OpenCV:
GrabCut segmentation → connected-component cleanup → hole filling →
row-wise torso fill → edge de-fringing → inpaint of background bleed.

A WebP version (127 KB) is served first, with a 600 px variant for small screens.

## Structure

```
index.html                        # single page
assets/css/editorial.css          # greyscale system
assets/js/editorial.js            # reveals + portrait pointer response
assets/img/salman-cutout-grey.*   # cut-out portrait (PNG + WebP + @sm)
```

## Notes

- Deploys automatically with the root site — the workflow publishes `main` to `gh-pages`
- Respects `prefers-reduced-motion`; no JS is required for content
- Print styles included
