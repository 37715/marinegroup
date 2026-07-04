# Marine Group — Porto-Vecchio

A new website for **Marine Group**, a three-generation nautical company in Porto-Vecchio, Corsica
(boat sales, rental, shipyard / *chantier naval*, and private marina).

The design — *"Au fil de l'eau"* — takes its cues from the company's own aerial photography:
crystalline Corsican turquoise, teak decks, granite coastline. As you scroll, the page
**descends through the water**, from pale seafoam at the top to deep abyss-teal at the bottom.

## Stack

Plain, dependency-free **static site** — just HTML, CSS and a little vanilla JavaScript.
Fast, hosts anywhere (Netlify, Vercel, GitHub Pages, OVH, a plain web server), nothing to build.

```
index.html      → markup & copy (French)
styles.css      → design system, layout, the "descent" gradient, responsive rules
main.js         → nav state, mobile menu, scroll reveals, hero parallax
assets/images/  → optimized photography, brand logos, favicon
```

## Run locally

Any static server works. For example:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` in a browser.

## Design system

| Token   | Hex       | Role                                  |
| ------- | --------- | ------------------------------------- |
| Abysse  | `#08252B` | deep teal ink — text, deepest section |
| Marine  | `#0F3B47` | marine navy                           |
| Lagon   | `#1CA3B5` | signature turquoise — accents, CTAs   |
| Écume   | `#F1F7F6` | pale seafoam — light background       |
| Teck    | `#C7A16A` | warm teak accent — used sparingly     |

- **Display:** Cabinet Grotesk · **Body:** Satoshi (both via Fontshare) · **Labels:** IBM Plex Mono (Google Fonts)
- Fonts load from CDNs; no local font files required.

## Editing content

All copy lives directly in `index.html` in readable French. Common edits:

- **Phone number:** search for `+33632866788` (the `tel:` link) and `06 32 86 67 88` (display).
- **Address / email:** in the `footer` section.
- **Images:** drop replacements into `assets/images/` keeping the same filename, or update the `src`.
  Keep photos wide and high-resolution; they are the heart of the design.

## Images

Photography and brand logos are the company's own assets, sourced from the existing
marinegroup.fr site and the [@marinegroup.portovecchio](https://www.instagram.com/marinegroup.portovecchio/)
Instagram, then resized and compressed for the web.

## Dev tooling (optional)

`package.json` includes `playwright-core`, used only to render review screenshots
(`_source_images/shoot.js`). It is **not** required to run or deploy the site.
