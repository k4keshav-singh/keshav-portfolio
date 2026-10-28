# Keshav Singh — portfolio

A static Next.js site: home page, three case studies, an interactive "Inside an AI workflow" walkthrough, an archive, and a contact section.

## Stack

- Next.js 16.4 (App Router, Turbopack), React 19.3, TypeScript
- Tailwind CSS 4. Display type: Fraunces (SIL OFL, self-hosted via `@fontsource-variable/fraunces`); UI text: Geist Sans / Mono from the `geist` package. No external font requests.
- No database, no API calls, no analytics, no runtime GitHub fetches

## Design

Studio-style layout inspired by brandappart.com, rebuilt originally around this portfolio's content (no code, copy, images, logos or commercial fonts from that site are used).

- **Type:** Inter Tight (SIL OFL, self-hosted via `@fontsource-variable/inter-tight`) for heavy, tightly tracked display headlines; Geist Sans for body; Geist Mono for tags. In a `.font-display` heading, `<em>` renders as the warm-grey second half of a two-tone headline.
- **Colour:** warm off-white paper, near-black ink, warm grey, one orange accent (`src/app/globals.css`).
- **Navigation (desktop):** fixed left rail with the stacked wordmark, six icon buttons (Work, Systems, Capabilities, About, Archive, Contact) with hover labels, and "Menu" at the bottom. Each icon opens a dark side panel (`<dialog>`) on its own tab: big grey links that turn cream on hover, plus recent case studies on the Work tab. Top-right: recruiter switch and "Get in touch". Wide screens add a right-edge scroll indicator and a live New Delhi clock. The rail flips to its dark style over dark sections. Mobile uses a top bar and the same panel full-width. All in `components/site-shell.tsx`.
- **Sections:** centered hero with a tool-name marquee and a looping, generic human-in-the-loop coding trace; a two-by-two grid of equal project tiles (big title appears on hover) with two principle note cards below; a dark "See more work" ring of archive cards that turns as you scroll; a stacked deck of capability panels that pin and shrink as the next one slides over (`components/deck-scroller.tsx`); tilted, overlapping "How I work" cards; experience; contact; a floating "Hiring an AI engineer?" bar.
- **Motion:** tool-name marquee, trace lines typing in, floating cards, scroll reveals and tilt-ins (CSS scroll-driven animations), card lift on hover. All of it stops with reduced motion; content never depends on it.

## Recruiter mode

A switch in the header (and a button in the hero) turns on a one-screen summary: who, now, education, three highlights with case-study links, skills, experience. It hides the long-form story sections.

- Shareable link: `https://your-domain/?mode=recruiter` opens straight into it (use this on LinkedIn or in applications).
- The choice is remembered per browser (localStorage, if allowed) and applied before first paint, so there's no flash.
- Highlights live in `src/content/recruiter.ts`; keep them in step with `projects.ts`.

## Project layout

```
src/
  app/
    layout.tsx            root layout, metadata, Person JSON-LD, skip link
    page.tsx              home: hero, work, walkthrough, tooling, archive, experience, contact
    work/[slug]/page.tsx  case-study template (static params, 404 for unknown slugs)
    sitemap.ts, robots.ts, not-found.tsx, globals.css (design tokens)
  components/             header, mobile menu, walkthrough, archive filter, copy-email, UI bits
  content/                ALL site copy as typed data — edit here, not in components
    types.ts              content model
    profile.ts            profile, principles, experience, education, skills
    projects.ts           featured projects + case-study content
    archive.ts            archive list, tooling (SOP) entries
    walkthroughs.ts       generic walkthrough scenarios (made-up data)
scripts/
  check-contrast.mjs      WCAG contrast check for the colour tokens
  qa.cjs                  Playwright + axe browser checks (optional extra deps)
private/                  audit, publication checklist, sensitive-terms list, resume PDFs — git-ignored, never deployed
```

## Run locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev            # http://localhost:3000
```

## Checks

```bash
npm run typecheck      # generates route types, then tsc --noEmit
npm run lint           # ESLint (next/core-web-vitals + typescript)
npm run check:contrast # colour-token contrast ratios
npm run build          # production build
npm run check          # all four, in order
```

Optional browser QA (responsive overflow at 360/768/1440, axe scan, keyboard, walkthrough controls, copy, recruiter mode, no-JS and reduced-motion, plus a confidentiality sweep of rendered HTML and client JS against `private/sensitive-terms.txt`):

```bash
npm i -D playwright axe-core && npx playwright install chromium
npm run build && npx next start -p 3100 &
node scripts/qa.cjs
```

## Configure the domain

The production domain isn't hard-coded. Set it at build time:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
```

Without it, canonical URLs point to localhost, pages carry `noindex`, and `robots.txt` disallows crawling — so preview deployments never get indexed by accident.

## Deploy

Any Node host that runs `next start` works. Two common options:

- **Vercel:** import the repository, add the `NEXT_PUBLIC_SITE_URL` environment variable, deploy. No other settings needed.
- **Self-hosted:** `npm ci && NEXT_PUBLIC_SITE_URL=… npm run build && npm start` (port 3000; put a reverse proxy with TLS in front).

Before the first public deploy, work through `private/publication-checklist.md`.

## Editing content

- Every factual claim lives in `src/content/`.
- **Confidentiality.** The internship projects are confidential company work. They are shown with descriptive titles (not internal names) and described at the level of my role and general engineering patterns: no internal names, code, architecture details, rules, prompts, configuration values, data, metrics, repository statistics, ticket IDs or teammates' details. Illustrations and walkthroughs are generic, with made-up data. Each case study ends with a "What I can't share" section. Don't add internal detail back without written permission from the company; see `private/publication-checklist.md`.
- After any content change, run the browser QA: its confidentiality sweep fails if a term from `private/sensitive-terms.txt` appears in the built site.
- To add a case study, add an object to `projects` in `src/content/projects.ts`; the route, sitemap and home list pick it up automatically.
