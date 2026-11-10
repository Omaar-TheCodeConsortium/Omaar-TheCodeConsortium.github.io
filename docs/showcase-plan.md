# Concept Showcase Plan

Last updated 10 November 2026.

**Status:** foundations are built on the `feature/concept-showcase` branch (not merged, not live). Grandstar Precision is built: six pages, a live quote builder and drawings made in code. Sunloom International is built with its 17 photographs in place and is marked live (indexable once deployed). The other four concepts each show a holding page.

## 1. What we are building

A new "Concepts" section on www.thecodeconsortium.com: one library page plus six mock brand sites. Each site is front end only, has real page depth, and is filled with believable data. The sites are sales material for pitching Chinese manufacturers and e-commerce sellers.

The mock sites speak to the buyers those companies want: European and American businesses and shoppers who source from China. Everything is in English.

**Out of scope for now:** back ends, real payments, real form submissions, Chinese-language versions.

## 2. The six concepts

Brand names are made up, and chosen to be names a Chinese exporter would plausibly pick for Western buyers: formal trading-company names built on the words exporters favour ("Global", "International", "Star", "Top"), in the manner of Star Rapid, Sunrise Metal or Global Sources. No pinyin, no clever English wordplay, and no broken English. Hoxen is the one coined name, in the style of Anker.

A web search on 10 November found no existing company using any of them in the same category. That is a quick check, not a trademark search.

| # | Brand | Category | The name | The idea |
|---|---|---|---|---|
| 1 | **Grandstar Precision** | Industrial B2B | Grand plus Star | Injection moulding and 3D printing supplier in Dongguan. Engineered and exact. |
| 2 | **Sunloom International** | Lifestyle | Sun plus loom | Washed-linen bedding and homeware. Editorial, slow, photographic. |
| 3 | **Hoxen** | Tech hardware | Coined, in the style of Anker or Ugreen | Phone cases, chargers and cables from Shenzhen. Spec-driven and precise. |
| 4 | **Topforce Sports** | Fitness | Top plus force | Dumbbells, plates, racks, kits. Loud, kinetic, heavy type. |
| 5 | **Tradewin Direct** | Drop shipping, consumer side | Trade plus win; "Direct" marks the consumer shop | A shop of small useful goods shipped direct. Playful. |
| 6 | **Tradewin Wholesale** | Drop shipping, business side | Same company, trade arm | The same catalogue for resellers: tiered pricing, minimum quantities, margins. |

Each site's footer carries a full registered-style company name, such as "Dongguan Grandstar Precision Technology Co., Ltd.", the way real exporters' sites do.

### Pages per site

| Brand | Pages |
|---|---|
| Grandstar Precision | Home · Capabilities · Materials library · Instant quote flow · Case study · Quality and certifications |
| Sunloom International | Home · Collection · Product · Our mill (story) · Wholesale enquiry · Cart |
| Hoxen | Home · Product with configurator · Compare · Compatibility checker · Cart |
| Topforce Sports | Home · Category · Product · Bundle builder · Cart |
| Tradewin Direct | Home · Category · Product · Cart · Order tracking |
| Tradewin Wholesale | Dashboard-style home · Catalogue with tier pricing · Product (trade view) · Margin calculator · Supplier terms |

That is about 32 pages in total.

### One signature interaction each

Each site gets one memorable moment, not a pile of effects.

- **Grandstar Precision:** a quote builder. Pick a process, material and quantity, and a price-per-part curve and lead time update live.
- **Sunloom International:** choosing a colour swatch re-tints the whole product page. Scrolling moves through a horizontal lookbook.
- **Hoxen:** scrolling pulls a charger apart into its layers, with specs attached to each part.
- **Topforce Sports:** load plates onto a barbell. The total weight and price update as you add them.
- **Tradewin Direct and Tradewin Wholesale:** a Direct / Wholesale switch. The same product flips from a retail price to a bulk price table with minimum quantities.

## 3. Design direction

### Colour: two quiet colours, one loud one

No purple anywhere. Each palette will be tested for text contrast before use; exact shades get fixed then.

| Brand | Quiet | Quiet | Loud |
|---|---|---|---|
| Grandstar Precision | Steel paper grey | Navy-black ink | Lockout-tag red |
| Sunloom International | Undyed oat | Soot brown | Indigo dye blue |
| Hoxen | Graphite | Fog grey | Safety orange |
| Topforce Sports | Iron black | Chalk white | Volt yellow-green |
| Tradewin Direct / Wholesale | Warm cream | Bottle green | Hot coral |

### Type

Each site gets its own typefaces, none of them Inter (the main site uses it). Proposals, all free to use:

- **Grandstar Precision:** IBM Plex Sans and Plex Mono
- **Sunloom International:** Newsreader with Switzer
- **Hoxen:** Schibsted Grotesk with Martian Mono
- **Topforce Sports:** Big Shoulders Display with Archivo
- **Tradewin Direct:** Bricolage Grotesque with Figtree

### Interaction quality

The `apple-hig-designer` skill is used for behaviour only: press feedback, 44px touch targets, easing and timing, focus rings, reduced-motion support. Its colours, fonts and iPhone-style components are not used.

### What every page is checked against

Taken from niki.aroca's "vibecoded" list, plus our own rules:

- No gradient headline text, glowing orbs, sparkle icons or glass panels as decoration
- No three identical feature cards in a row, no generic three-tier pricing
- No badge sitting above every headline, no emoji in headings
- Not everything fades in on scroll; motion is used where it explains something
- Buttons say what they do ("Request a sample", not "Get started")
- Every claim has a number or a proof next to it
- Consistent spacing, readable contrast, forms that work from the keyboard

### Mock data

- People's names drawn from a realistic mix for the UK, EU and US; no stock AI names
- Reviews of uneven length and uneven rating, some with complaints
- Trade details buyers expect: minimum order quantity, lead time, sample cost, Incoterms, certifications such as CE, RoHS and ISO 9001
- Prices in USD with believable, non-round numbers; real-looking SKUs

## 4. The library page and the transition

- **Address:** `/concepts`, with each site under `/concepts/<brand>`.
- **Look:** matches the main site: black and white, hairline borders, Inter and JetBrains Mono. The plainness makes the jump into each brand more dramatic.
- **Only the library matches the main site.** The concept sites carry none of its styling: each gets typefaces, colours and layout chosen for its own industry.
- **Honesty:** the page says these are concept builds, not client work. The existing `/showcase` page stays as the home of real projects.
- **Transition:** the clicked card expands to fill the screen in that brand's loud colour, the grid dissolves, and the brand's type and palette arrive. A small "Built by The Code Consortium" tab on every concept page reverses it.
- **Reduced motion:** visitors who ask for less motion get a simple cross-fade.

## 5. How it fits into the repo

- **Folder:** each concept lives in `src/concepts/<brand>/` with its own pages, data and styles.
- **Loading:** each concept loads only when visited, so the main site does not get heavier. Today everything ships in one 562 KB file.
- **Style isolation:** each concept scopes its colours and fonts to its own root. The main site's global 92% zoom is switched off inside concepts.
- **Animation:** GSAP with ScrollTrigger and Flip is added. A few React Bits components are copied in and restyled per brand. Framer Motion stays for the existing pages.
- **Pre-rendered pages:** every concept page is built into its own real HTML file. See section 6 for why.
- **Images:** stored under `public/concepts/<brand>/`, compressed. Until real images arrive, pages use flat colour blocks labelled with the shot they need.

### Fix before any pull request

The deploy workflow publishes to the live site both when a pull request to main is opened or updated and when one is merged. Checked on 10 November against the run history:

- Every recent update of the live site happened about 20 seconds after a pull request run, before the merge.
- On 11 September the fix commit on pull request #16 went live while main was still failing its checks. That pull request was not merged until 3 November, so the live site ran unmerged code for about seven weeks.
- The main branch has no protection rules.

The deploy step must be limited to pushes to main, so that only a merge publishes. Pull requests will still run the lint and build checks.

All work happens on a feature branch. Nothing goes to main until you approve it.

## 6. SEO and AI readability

The goal is technical SEO that can be measured and shown to a prospect. It is not a promise of ranking: traffic also depends on content, links and time, which a mock site cannot have.

### The structural problem to solve first

The site today is a single page that builds itself in the browser with JavaScript. A direct visit to any inner address returns a "404 not found" response and then redirects. Search engines treat that as a missing page, and most AI crawlers do not run JavaScript at all, so they see an empty page.

The fix is pre-rendering: at build time, every concept page is written out as a complete HTML file with its content already in it. This is the single most important SEO item and it goes into the foundations phase. The exact tool is chosen there, after checking it works with this repo's versions of React and Vite.

### On every page

- **Headings:** exactly one H1, then H2 and H3 in logical order
- **Semantic structure:** proper header, nav, main and footer regions; real buttons and links
- **Head tags:** a unique title and description per page, a canonical address, and social sharing tags with a preview image
- **Structured data:** machine-readable descriptions of the organisation, products with prices and availability, breadcrumbs and FAQs
- **Images:** descriptive alt text, fixed dimensions so the page does not jump, modern compressed formats, lazy loading below the fold
- **Links and addresses:** descriptive link text and clean, readable addresses
- **Speed:** budgets for load time and layout stability. Animation must not delay the main content or shift the layout. Fonts are served from the site itself

### Site-wide

- **sitemap.xml and robots.txt** covering the concept pages
- **llms.txt:** a plain-text summary of each site for AI assistants. This is a new convention, not a standard, and it is uncertain how many AI systems read it. It is cheap to include

### What is deliberately left out

- **Review and rating markup:** the reviews are invented. Google's rules forbid marking up fake reviews, so reviews appear on the page but are not flagged to search engines as real ratings

### Proof for prospects

Each concept is run through Google's Lighthouse audit and its structured-data test. The library page shows each concept's measured scores. Only measured numbers are shown.

### Decided: concept pages are indexed

Decided 10 November 2026. Search engines may index the concept pages, so audit scores are complete and prospects can verify them.

Each page carries a visible "concept build by The Code Consortium" label, and the same wording appears in its description for search engines, so nobody mistakes the brand for a real company.

## 7. Build order

Fable 5.2 is available until 15 November, so the work that sets the quality bar comes first.

| Phase | Dates | Work |
|---|---|---|
| 0. Foundations | 10–12 Nov | Workflow fix, feature branch, install the skill, folder structure, lazy loading, style isolation, pre-rendering and SEO base, library page, transition |
| 1. Grandstar Precision | 11–13 Nov | First full concept. Needs the fewest photos, since diagrams and drawings can be made in code |
| 2. Sunloom International | 13–15 Nov | The opposite extreme: editorial and photo-led. Needs your images by 13 Nov |
| 3. Hoxen | after 15 Nov | Built on Opus 5.5, using the first two as reference |
| 4. Topforce Sports | after 15 Nov | |
| 5. Tradewin Direct and Tradewin Wholesale | after 15 Nov | Built together, since they share a catalogue |

The dates are estimates. Pre-rendering adds roughly a day to foundations, so Grandstar Precision and Sunloom International overlap the remaining three days. Two full concepts plus foundations in five days is ambitious; if time runs short, Sunloom International's home and product pages take priority over its remaining pages.

Each phase ends with you reviewing the result in the browser before the next begins.

## 8. What I need from you

1. **Names:** approve or replace the five brand names.
2. **Images:** I write a shot list per site (subject, angle, lighting, crop). You generate them in Flow. Sunloom International's list comes first.
3. **Reference sites:** two or three real sites you admire per category, and what you like about each. Starting points:
   - Industrial: Protolabs, Xometry, Fictiv
   - Lifestyle: Piglet in Bed, Parachute, HAY
   - Tech: Nomad Goods, Peak Design, Teenage Engineering
   - Fitness: Rogue, Eleiko
   - Drop shipping: Spocket, Zendrop, Faire
4. **Your earlier research:** paste the findings from your other Claude chat into `docs/research.md` so the copy can speak to the customers you identified.
5. **Decision:** confirm `/concepts` as the address.
