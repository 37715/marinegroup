# Marine Group — Porto-Vecchio

A new website for **Marine Group**, a three-generation nautical company in Porto-Vecchio, Corsica
— luxury boat & yacht **rental**, **sales** (neuf & occasion), **shipyard** (*chantier naval*),
and a **private marina**.

The design is deliberately *quiet luxury*: restrained typography, generous space, and the
company's own aerial photography of crystalline Corsican turquoise doing the talking. Teak/brass
is the only warm accent; turquoise is reserved for the water, never the UI.

## Stack

Plain, dependency-free **static site** — HTML, CSS and a little vanilla JavaScript.
Fast, hosts anywhere (Netlify, Vercel, GitHub Pages, OVH, any web server), nothing to build.

```
index.html                     → single-page site: hero, fleet, history, sales, shipyard, marina, events, contact
mentions-legales.html          → legal notice
politique-confidentialite.html → privacy policy (RGPD)
styles.css                     → design system, layout, responsive rules
main.js                        → nav state, mobile menu, scroll reveals, fleet filter, contact form
assets/images/                 → optimized photography (+ assets/images/fleet/ per-model shots)
```

## The fleet

The rental fleet is the centrepiece, near the top of the page, with a category filter
(Semi-rigides / Day cruisers / Vedettes / Yachts). Each boat has its own photo, specs
(length · guests · power) and day rate, mirroring the real listings on marinegroup.fr.

## Run locally

Any static server works:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` in a browser.

## Design system

| Token   | Hex       | Role                                        |
| ------- | --------- | ------------------------------------------- |
| Abysse  | `#08252B` | deep teal ink — text, deepest sections      |
| Marine  | `#0F3B47` | marine navy — sales / shipyard backgrounds  |
| Lagon   | `#1CA3B5` | Corsican turquoise — the water only         |
| Écume   | `#F3F8F7` | pale seafoam — light backgrounds            |
| Teck    | `#C7A16A` | warm teak/brass — the single UI accent      |

- **Headings & body:** Satoshi (Fontshare), used at light weights for a minimal, editorial feel.
- **Data & labels:** IBM Plex Mono (Google Fonts) — specs, prices, coordinates, eyebrows.
- Fonts load from CDNs; no local font files required.

## The contact form

The enquiry form is backend-free: on submit it opens the visitor's mail client with a
pre-filled message to `marinegroup2a@gmail.com`. To use a hosted form service instead
(e.g. Formspree), swap the submit handler in `main.js`.

## Editing content

All copy lives in `index.html` in readable French. Common edits:

- **Phone:** search `+33632866788` (`tel:` link) and `06 32 86 67 88` (display).
- **Fleet:** each boat is an `<article class="boat" data-cat="…">` block — edit name, specs, price, image.
- **Address / email:** in the `#contact` section and the footer.
- **Images:** drop replacements into `assets/images/` (or `assets/images/fleet/`) keeping the same filename.

> Legal pages contain placeholders marked *à compléter* (SIRET, hébergeur, etc.) for the owner to fill in.

## Dev tooling (optional)

Image optimization (`_source_images/optimize*.py`, Pillow) and review screenshots
(`_source_images/shoot.js`, playwright-core) are **not** required to run or deploy the site.
