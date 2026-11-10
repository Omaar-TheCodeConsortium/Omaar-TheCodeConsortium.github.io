# The Code Consortium website

Vite + React single-page site, deployed to GitHub Pages (www.thecodeconsortium.com) by `.github/workflows/deploy.yml` when a commit lands on `main`. Pull requests run lint and build only.

## Commands

- `npm run dev`: local development
- `npm run lint`: must pass, CI runs it
- `npm run build`: client build, then pre-renders the concept pages into `dist/`
- `npm run preview`: serve the built site, including the pre-rendered pages
- `npm run check:contrast`: check every concept palette for readable contrast

## Concept builds (`/concepts/`)

Mock sites for fictional Chinese export brands, used as sales material. The full plan, brand list and build order are in `docs/showcase-plan.md`. Read it before working on a concept.

### Rules

- **Concept sites do not carry the main site's look.** Each one is for a different kind of customer and gets its own typefaces, colours, layout and motion, chosen to suit its industry. Never reuse the main site's Inter / JetBrains Mono / black-and-white grid styling inside a concept. Only the library page (`src/pages/ConceptLibrary.jsx`) and the small return tab match the main site.
- **Each concept should look different from the others.** Show range.
- **Change the skeleton, not just the paint.** Grandstar Precision was judged too close to the main site because it kept the same structure: a centred max-width column with empty side margins, a logo-left top bar, a column footer, hairline-ruled tables and small monospace labels. For every other concept use the full width of the screen, give navigation and footer a different shape, scale type to the viewport and lead with one strong visual idea. The bar is "stunning", not "tidy".
- **No purple** unless there is a specific reason.
- **Nothing that reads as AI-generated.** No stock names, no gradient headline text, glowing orbs, sparkle icons, decorative glass panels, three identical feature cards, generic three-tier pricing, badges above headlines, or everything fading in on scroll. Buttons say what they do. Claims carry a number or proof.
- **Colour:** two quiet colours and one loud one per concept. Run `npm run check:contrast` after changing a palette.
- **Brand names** are formal exporter-style names (see the plan). Do not rename them without asking.
- **SEO on every page:** exactly one H1, ordered headings, semantic regions, a unique title and description, descriptive alt text. Do not add review or rating structured data: the reviews are invented.
- **Interaction quality:** use the `apple-hig-designer` skill in `.claude/skills/` for behaviour only (press feedback, 44px touch targets, easing, focus rings, reduced motion). Do not use its colours, fonts or iOS-style components.

### How it fits together

- `src/concepts/registry.js`: the one list of concepts. Routes, the library page, the transition, head tags and pre-rendering all read from it. Set `status: 'live'` when a concept is finished; until then it is hidden from search engines and the sitemap.
- `src/concepts/<brand>/index.jsx`: the entry for each concept, loaded on demand. Import that brand's fonts here (self-hosted through `@fontsource`), so they are only downloaded for that concept.
- `src/concepts/ConceptShell.jsx`: wraps every concept. Sets the palette variables, switches off the main site's 92% page zoom, and provides the way back to the library.
- `src/concepts/portal/`: the full-screen transition between the library and a concept.
- `src/seo/meta.js`: titles, descriptions, canonical addresses and structured data.
- `scripts/prerender.mjs`: runs after the build and writes each concept route as a complete HTML file, plus `sitemap.xml` and `llms.txt`.
- Internal links to concept pages end with a slash (`/concepts/grandstar/`), matching how GitHub Pages serves them.
- Code that runs during rendering must not touch `window` or `document`; pre-rendering runs it in Node. Use effects.
