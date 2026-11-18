# Main site overhaul: plan

Written 18 November 2026.

## Status

**Direction changed on 18 November 2026.** thecodeconsortium.com is the parent company's site, for investors, future employees, partners and reviewers. Customers go to each product's own site. The page presents the company and every product it makes, across industries. The section on positioning below is kept as background; this paragraph and the list after it describe what is built.

Built, on the preview only:

- **Home page.** In order:
  - the motto "Software built to solve, not just run.";
  - a moving wall of real product screens;
  - the products as chapters: Spear OS, Spear Tea OS, TCCOS;
  - how we build;
  - the Lab (BakeryOS and Bespoke Salon, ready to deploy);
  - the concept builds, with an enquiry button;
  - a timeline;
  - the founders;
  - contact.
- **Motion.** Done with GSAP: the headline rises in, the screen wall drifts, the product picture stays pinned while the chapters scroll, the icons draw themselves and the timeline draws as it scrolls. All of it stops when the visitor has asked for reduced motion.
- **Pages.** `/products/spear-os/`, `/products/tea-os/`, `/products/tccos/` and `/lab/`.

Facts that are still missing show as marked gaps such as "[City]". They are filled in through one file, `src/company.js`. A production build (`npm run build`) stops while any gap is left, so the site cannot reach `main` with gaps in it.

### What Google's support team asked for (23 October 2026)

| Requirement | How the site meets it |
|---|---|
| A live product interface, not only a landing page with "Request a demo" or "Join waitlist" | Spear Tea OS is linked as a working app, with real screens from it. No "Book a demo" button anywhere on the site. |
| Founders and team shown, checkable through public links on the domain | A team section with a LinkedIn link for each founder, plus GitHub and the company's LinkedIn page. |
| Emails on the domain are administrators on the Cloud billing account used for the application | Done in Google Cloud, not on the website. |

A new application is needed: the old one stays tied to the domain it was submitted with.

## Why

Startup programmes (Anthropic's and Google's) read thecodeconsortium.com as a software agency, not a company that builds and owns its products. They were right to. The site sells custom work:

- "Start your project", "Let's build together" and a "Service Map".
- A showcase of builds, with no products, owners or status.
- No founders, location or company details.

Most of the copy is generic AI-written text: "Meet the new digital standard", "digital powerhouses", "Transmit data", "Elite Software Engineering".

The look stays: Inter, the mono labels, black on white, the ruled grid. Only the content, its order and the showcase visuals change.

## What is true today

| | Status | Where |
|---|---|---|
| **The Code Consortium** | Parent company. Builds, owns, hosts and supports its own software. Does not take on other companies' code or run their IT. | thecodeconsortium.com |
| **Spear OS** | Flagship product. Hotel PMS and restaurant POS. In development with its first customer committed (pilot). Sold by subscription. | spear-os.com |
| **Spear Tea OS** | Tab ledger for tea shops, under the Spear name. Built. Offline first, runs on any phone, Sinhala, Tamil and English, activated by licence, no monthly fee. First shop lined up. | teashopos.spear-os.com |
| **HRIS Command Center** | Proof of concept. The customer deal fell through. On hold. | /project/hris-command-center |
| **BakeryOS, Bespoke Salon** | Demonstrations. No customers. On hold. | /project/… |
| **Concept builds** | Five mock sites for fictional exporters. Sales material for design and marketing work. | /concepts/ (preview only) |
| **Partner-code model** | An idea: take other developers' software to market and pay them royalties. Not started; legal side not looked at. | Nowhere |

There are no paying customers live yet and no figures to publish. That is normal at this stage, and the site should say so plainly rather than hide it.

## Positioning

**The Code Consortium is a product company, and Spear OS is what it makes.** Every page should make that clear within one screen.

The parent-and-product split (TCC as the company, spear-os.com as the product site) is sound. Plenty of companies do it, and it lets Spear be marketed on its own. It works only if the two sites point at each other clearly:

1. The TCC home page names Spear OS in its first screen.
2. TCC carries its own short page for each product, with a plain link out to the product site. No automatic redirect: today "Details" on Spear shows a 1.5-second splash and then leaves the site, so a reviewer never learns what Spear is from the company that makes it.
3. spear-os.com and the Tea OS site say "A product of The Code Consortium" in the footer and link back. (These are separate sites, outside this repo.)
4. Applications go in as The Code Consortium, naming Spear OS as the product, with thecodeconsortium.com as the website.

**Every product carries an honest status label**: In development, Pilot, Prototype, or On hold. A company that is early and says so reads better than one that is vague.

### What stays off the main site for now

- **The partner-code and royalty model.** It isn't running, the legal side is unexamined, and on a page it reads as reselling other people's work. That is the exact impression we are trying to remove.
- **Marketing and SEO services**, on the home page at least. See decision 1 for where the concept builds go.

## The new home page

The same ruled grid, scroll tracker and type. Sections in this order:

1. **Hero.** The H1 says what the company is, for example "We build and run the software Sri Lankan hotels, restaurants and tea shops work on." The line under it introduces Spear OS and its stage. Buttons: "See Spear OS" and "Contact us". The animated badge goes.
2. **Products.** Replaces "Showcase".
   - Spear OS gets a full-width panel: what it does, who it is for, its status, which modules are built and which are coming, a large cropped screen from the real product, and a link to its page.
   - Spear Tea OS gets a second, smaller panel: phone screens and its three-step flow.
3. **How we work.** Replaces the three feature cards and the Service Map:
   - We write the code and own it.
   - Hotels and restaurants subscribe; shops buy a licence.
   - We host it, update it and support it.
   - Setting up a new customer means configuring the product, not building a new one.
   - We don't maintain anyone else's software.
4. **How it's built.** Replaces the scrolling list of tools. Three or four specific decisions that show the work is ours, for example:
   - the POS runs as an offline desktop app;
   - the ledger only ever appends;
   - Tea OS installs once, runs with no internet and is activated by licence;
   - Tea OS works in three languages.

   Built things only.
5. **Prototypes.** BakeryOS, HRIS and Salon as smaller cards labelled "Prototype", each with one line on what it explored.
6. **What's next.** A dated roadmap: Spear pilot live, first Tea OS shop, the next modules. It also says honestly how AI fits, both in the products and in how we build them (Tea OS was built with Claude). That matters to Anthropic's and Google's programmes.
7. **Company and contact.** Founders with names, roles and photos, the city, year founded and registration number. A plain form whose button says "Send message", plus an email address.

**Removed:** the badge, "digital powerhouses", the three feature cards, the Service Map, the tool list, "Transmit data" and "Initialize sequence".

## Other pages

- **`/products/spear-os/`**: replaces the redirect at `/project/spear`. Covers what it does, its modules and their status, who it is for, how it's priced, the pilot, screens, and a link to spear-os.com.
- **`/products/tea-os/`**: the same for Spear Tea OS.
- **`/prototypes/`**: replaces the Project Archive. The existing `/project/…` pages stay at their addresses as prototype pages. The "This management dashboard sub-module is under active construction" text is removed.
- **`/company/`**: who we are, the team, the business model, contact details.
- **`/concepts/`**: kept, linked from wherever decision 1 lands.
- **Head tags**:
  - Title "The Code Consortium: makers of Spear OS" (or similar), replacing "Elite Software Engineering".
  - Organization structured data with founders, address and the products as SoftwareApplication entries.
  - No ratings or reviews.

## Visual fixes (no new facts needed)

- **The home page is not pre-rendered.** Its HTML is an empty shell, so anything that reads a page without running JavaScript sees nothing: link previews, many crawlers, AI summarisers, possibly a programme's screening tools. Add `/`, the product pages and the company page to `scripts/prerender.mjs`.
- **Sections vanish.** Each one fades in only while on screen and fades out again when it leaves (`viewport: { once: false }`). A full-page screenshot of the home page is almost blank. Make the reveal happen once and leave content visible.
- **Product screens.** Use large crops of one real screen with realistic data, in a plain device or browser frame. Not whole-app screenshots shrunk into grey boxes, the Spear marketing banner, or an empty bill reading "Rs. 0.00".
- **Phone overlap.** The scroll-tracker dashes sit on top of the cards at the right edge on phones. Hide the tracker below tablet width.

## Copy rules

- Plain, specific, first person plural. Every claim is something we have built or can show.
- No figures until they are real. Status labels and dates stand in for them.
- Buttons say what they do.
- I can draft. **The founders rewrite it in their own words before it goes live.** Reviewers don't penalise AI-written text as such; they penalise text that could be about any company.

## Outside this repo: spear-os.com

spear-os.com lists features such as two-way sync with Booking.com, Expedia, Airbnb and Agoda, occupancy-based surge pricing and a biometric timeclock. A reviewer who follows the link from TCC will read these as built. Anything not yet built should say "Coming" or move to a roadmap. The copy has the same AI tone as the TCC site.

## Phases

Each phase ends committed and on the preview.

1. **Decisions and facts.** You (see below).
2. **Fixes that need no new facts:** pre-render the home page, make reveals happen once, fix the phone overlap, change the head title.
3. **Home page restructure** with drafted copy, gaps marked, for you to edit.
4. **Product pages, prototypes page and company page.**
5. **Concept library placement, structured data, sitemap.**
6. **Checks** (lint, build, phone, Lighthouse). Then decide on merging to `main`, which also puts the concept builds live.

Work continues on `feature/concept-showcase` so one preview shows everything.

## Decisions and facts needed

1. **Concept builds.** Recommended: a "Studio" link in the footer only, not the main nav, while you are applying to programmes. The alternatives are a separate brand or domain for design and marketing work, or keeping them in the nav (not recommended).
2. **Company:** founders' names, roles and photos, the city, year founded, registration number.
3. **The Spear pilot:** may we name the customer, or describe them (for example "a 24-room hotel in Galle")? When is go-live expected?
4. **Spear OS modules:** which are built, which are in progress, which are planned?
5. **Tea OS:** the activation price, and may we publish it? When does the first shop start?
6. **Roadmap dates** for the next six to twelve months.
7. **Prototypes:** keep all three (BakeryOS, HRIS, Salon) as prototypes, or drop any?
8. **Is the country Sri Lanka?** The products are in Sinhala and Tamil and priced in rupees.
