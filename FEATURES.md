# HackSL - Features

**Hack Sri Lanka** is an open-source platform for discovering hackathons and tech
events across Sri Lanka. It is a Next.js (App Router) application styled with
Tailwind CSS, backed by Vercel Postgres for data and Vercel Blob for image
uploads. This document catalogs every feature in the project.

- **Stack:** Next.js 16 (App Router, React 19), Tailwind CSS v4, TypeScript
- **Data:** Vercel Postgres (`@vercel/postgres`)
- **File storage:** Vercel Blob (`@vercel/blob`)
- **Email:** Nodemailer (SMTP)
- **Fonts:** Geist Sans + Geist Mono (`next/font`)

---

## 1. Public site

### 1.1 Landing page (`/`)
The home page (`src/app/page.tsx`) is server-rendered (`force-dynamic`) and loads
live hackathon data from the database. It composes these sections in order:

1. **Hero** - headline, stats, and primary CTAs (theme-aware, see §4).
2. **Hackathons** - filterable directory of events.
3. **Organize a Hackathon** - CTA section for event organizers.
4. **Partners** - scrolling logo marquee.
5. **Fellows** - University Ambassador program teaser.
6. **About Us** - vision / what we do / who we are.
7. **Mission** - quote-style mission statement.
8. **Blog** - latest community posts.
9. **Community** - social/community links.
10. **Team** - founder profiles.
11. **Contact Us** - contact form + direct contact info.

A fixed **Header** (top nav) and **Footer** wrap every page.

### 1.2 Header / navigation (`Header.tsx`)
- Fixed, blurred top bar with the HackSL logo (logo swaps between standard and
  dark variants depending on Hacker Mode).
- Desktop nav links: Hackathons, Blog, Community, About, plus a low-emphasis
  **Admin** link.
- Hacker Mode toggle and (when not in Hacker Mode) a light/dark Theme toggle.
- "Get in touch" CTA (renders as `>_ Get in touch` in Hacker Mode).
- Responsive hamburger menu with an animated open/close icon for mobile.

### 1.3 Footer (`Footer.tsx`)
- Brand blurb, "Founded 2023 · Nonprofit" tag.
- Navigation links (Hackathons, Fellows, Blog, About, Contact).
- Social links (LinkedIn, Facebook, Instagram, WhatsApp).
- Auto-updating copyright year.

---

## 2. Hackathon directory

### 2.1 Listing & cards (`HackathonsSection.tsx`, `HackathonCard.tsx`)
- Responsive grid of hackathon cards.
- Each card shows: banner image (or a gradient with the event's first initial as
  fallback), an **Online / In-person** mode badge, formatted date, name,
  organizer, a 2-line description, up to two tags, and a "View →" link.
- Cards link out to the event's registration URL in a new tab.
- Local images use the optimized `next/image`; remote URLs fall back to a plain
  `<img>`.

### 2.2 Filtering (`HackathonFilters.tsx`)
Client-side, multi-select filtering with live results:
- **Location:** Online / In-person.
- **Status:** Upcoming / Open / Ended (each with a colored dot).
- **Length:** 1–6 days / 1–4 weeks / 1+ month.
- **Interest tags:** a curated tech tag list (Beginner Friendly, ML/AI, Web,
  Mobile, Blockchain, IoT, Cybersecurity, Open Source, Social Good, etc.) merged
  with tags actually present on events. Organization/university tags are
  excluded from the tag filter. Tags collapse to the first 5 with a
  "Show more (N)" expander.
- On mobile, filters collapse behind a "Filters ▼/▲" toggle.
- An empty-results state offers a one-click "clear filters".

### 2.3 Status derivation (`hackathon-types.ts`)
- A hackathon's status uses an explicit `status` field when set, otherwise it is
  derived from the event date (past dates → "ended", otherwise "upcoming").
- `formatDate` renders dates as `Mon D, YYYY`.

### 2.4 Data model
`Hackathon` fields: `id`, `name`, `description`, `date`, `location`,
`registrationUrl`, `organizer`, `tags[]`, optional `image`, `mode`
(`online` | `in-person`), `status` (`upcoming` | `open` | `ended`), and `length`.

---

## 3. Blog

### 3.1 Home blog section (`Blog.tsx`)
- Shows the 9 most recent posts on the home page.
- A "Read more →" button links to the full blog page when more posts exist.

### 3.2 Blog listing page (`/blog`, `BlogListing.tsx`)
- Lists every post in a responsive grid.
- **Type filter:** pill buttons built dynamically from the post types actually
  present (plus "All").
- **Sort:** Newest first / Oldest first.
- Live count of visible posts ("Showing N posts in <type>").

### 3.3 Blog cards (`BlogCard.tsx`, `BlogCardArt.tsx`)
- Each card shows a cover image (or generated `BlogCardArt` when no image),
  formatted date, type badge, title, optional author byline, 2-line excerpt, and
  "Read more →".

### 3.4 Blog post page (`/blog/[slug]`)
- Server-rendered with per-post SEO metadata and Open Graph tags (including the
  post image when present).
- Header band uses the post image (darkened) or a gradient fallback, showing
  date, title, author byline, and excerpt.
- Body renders the post's Markdown content (see §3.5), falling back to the
  excerpt when there is no content.
- "Keep reading" section with up to 3 related posts.
- Unknown slugs return Next.js `notFound()` (404).

### 3.5 Safe Markdown renderer (`Markdown.tsx`)
A small, dependency-free Markdown subset that never injects raw HTML:
- Block elements: `##`/`###` headings, `>` blockquotes, `-`/`*` unordered lists,
  numbered ordered lists, and paragraphs.
- Inline `**bold**` emphasis.

### 3.6 Blog data model & types
`BlogPost` fields: `id`, `title`, `excerpt`, `date`, `slug`, optional `author`,
`image`, `content`, and `type`. Allowed `type` values
(`blog-types.ts`): Hackathon, Designathon, Datathon, OC, CTF, Other.

---

## 4. Theming & "Hacker Mode"

### 4.1 Light / dark theme (`ThemeProvider.tsx`, `ThemeToggle.tsx`)
- Light/dark theme stored in `localStorage`, defaulting to the OS color-scheme
  preference.
- An inline script in `layout.tsx` applies the saved theme before first paint to
  avoid flash-of-wrong-theme.
- CSS variables (`globals.css`) drive all colors so components stay theme-aware.

### 4.2 Hacker Mode (`HackerModeProvider.tsx`, `HackerModeToggle.tsx`)
- A site-wide "dark-web / terminal" aesthetic, **on by default**; users opt out
  and the choice persists in `localStorage`.
- Independent of the light/dark theme; toggles a `data-hacker` attribute on
  `<html>` that recolors the whole site via CSS.
- Pre-paint inline script prevents a flash on load.

### 4.3 Visual effects (`PageEffects.tsx`)
- **Hacker Mode on:** site-wide Matrix "digital rain" overlay + CRT scanlines.
- **Hacker Mode off:** soft animated gradient orbs + grid backdrop
  (`AnimatedBackground.tsx`).
- A custom cursor effect (`CursorEffect.tsx`) renders in both modes.

### 4.4 Themed Hero (`Hero.tsx`)
Two distinct hero treatments selected by Hacker Mode:
- **Regular hero:** purple gradient, grid pattern, radial glow, headline, CTAs,
  and a 4-stat grid (50+ hackathons, 50K+ hackers, 25+ universities, founded
  2023).
- **Hacker hero:** terminal showpiece with confined Matrix rain, a glitching
  headline (`GlitchText.tsx`), a typewriter "boot sequence"
  (`Typewriter.tsx`), and animated count-up stats (`CountUp.tsx`).

---

## 5. Marketing / informational sections

- **Organize a Hackathon** (`StartHackathon.tsx`) - organizer CTA pointing to
  WhatsApp and the contact section.
- **Partners** (`Partners.tsx`) - infinite, pause-on-hover marquee of 20+
  partner/university logos, with per-logo error fallback to initials and edge
  fade masks.
- **About Us** (`AboutUs.tsx`) - Vision / What We Do / Who We Are cards.
- **Mission** (`Mission.tsx`) - large pull-quote mission statement.
- **Team** (`Team.tsx`) - founder cards with photo (initials fallback), role, and
  LinkedIn link.
- **Community** (`Community.tsx`) - WhatsApp, LinkedIn, Facebook, and Instagram
  cards with brand-colored hover states.
- **Photo Carousel** (`PhotoCarousel.tsx`) - auto-advancing "Moments" image
  carousel with clickable dot indicators (component available in the codebase).

---

## 6. Fellows program

### 6.1 Home teaser (`HackSLFellows.tsx`)
- Summary of the University Ambassador program with a 4-perk grid, an "Apply now"
  (WhatsApp) CTA, and a "Learn more" link to the dedicated page.

### 6.2 Fellows page (`/fellows`)
A full landing page with its own SEO metadata covering:
- Program intro and explanation.
- Responsibilities ("What you'll do").
- Perks ("What you'll get").
- A 4-step "How it works" timeline (Apply → Connect → Onboard → Lead).
- Eligibility checklist.
- Apply / Contact / Back-home CTAs.

---

## 7. Contact

### 7.1 Contact section (`ContactUs.tsx`)
- Contact form (name, email, message) with idle/sending/sent/error states and
  inline success/failure messages.
- Side panel with a WhatsApp community CTA (fastest response) and a direct email
  address.

### 7.2 Contact API (`/api/contact`)
- `POST` validates that name, email, and message are present.
- Sends the submission via SMTP (Nodemailer) to `CONTACT_TO`
  (default `hackslcontact@gmail.com`), with the submitter's address as `replyTo`.
- Requires `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` (and optional `SMTP_PORT`);
  port 465 uses TLS.

---

## 8. Admin panel (`/admin`)

A single-page admin console gated by authentication, with three tabs.

### 8.1 Authentication
- Session check on load via `/api/auth/session`; shows a login form when
  unauthenticated and a loading state while checking.
- Username/password login form posts to `/api/auth/login`.
- "Log out" clears the session.

### 8.2 Hackathons tab
- Create/edit form with: name, description, date, location, registration URL,
  organizer, mode, status, length, tags, and an event image.
- **Tag editor:** add tags via button or Enter key; remove individual tags.
- **Image upload:** upload a file to Vercel Blob or paste a URL, with a live
  preview and remove button.
- List of existing hackathons with **Edit** (loads into the form) and **Delete**
  (with confirmation) actions.
- Form toggles between "Add" and "Update" modes, with a "Cancel edit" option.
- Success/error status messages.

### 8.3 Blog tab
- Create/edit form with: title, date, slug (optional), author, type (from the
  allowed list), excerpt, optional image (upload or URL with preview/remove), and
  Markdown content.
- List of existing posts with Edit / Delete (confirmation) actions.
- Add/Update mode with "Cancel edit".

### 8.4 User Admin tab
- Shows the signed-in admin and a "coming soon" note (credentials are currently
  configured via environment variables).

---

## 9. Authentication & security (`src/lib/auth.ts`)

- **Credential check:** compares username/password against
  `HACKSL_ADMIN_USERNAME` / `HACKSL_ADMIN_PASSWORD` using constant-time
  comparison (`timingSafeEqual`) to resist timing attacks.
- **Session tokens:** HMAC-SHA256-signed tokens (`payload.signature`) carrying
  the username and a 24-hour expiry, signed with `HACKSL_ADMIN_SECRET`.
- **Session cookie:** `hacksl_admin_session`, `httpOnly`, `sameSite=lax`,
  `secure` in production, 24-hour max age.
- **Auth API routes:**
  - `POST /api/auth/login` - verifies credentials, sets the session cookie.
  - `POST /api/auth/logout` - clears the session.
  - `GET /api/auth/session` - reports authentication status.
- **Protected admin APIs** accept either a valid session cookie or a legacy
  `Authorization: Bearer <HACKSL_ADMIN_SECRET>` header.

---

## 10. API routes summary

| Route | Method(s) | Auth | Purpose |
|-------|-----------|------|---------|
| `/api/hackathons` | GET | public | List all hackathons |
| `/api/blogs` | GET | public | List all blog posts |
| `/api/admin/hackathons` | POST, DELETE | admin | Create/update & delete hackathons |
| `/api/admin/blogs` | POST, DELETE | admin | Create/update & delete blog posts |
| `/api/admin/upload` | POST | admin | Upload an image to Vercel Blob |
| `/api/contact` | POST | public | Send a contact-form email |
| `/api/auth/login` | POST | public | Admin login |
| `/api/auth/logout` | POST | - | Admin logout |
| `/api/auth/session` | GET | - | Check session status |

### 10.1 Admin mutations
- Hackathon and blog POSTs **upsert** by `id` (insert or update on conflict),
  with server-side validation/normalization of enum fields and sensible
  defaults. DELETE removes by `id` query parameter.

### 10.2 Image upload (`/api/admin/upload`)
- Auth-protected. Accepts JPEG, PNG, WebP, GIF, and SVG up to **5 MB**.
- Stores files publicly in Vercel Blob under a folder prefix
  (`uploads/` by default, `blog/` for blog images), timestamping filenames.

---

## 11. Data layer (`src/lib/db.ts`, `hackathons.ts`, `blogs.ts`)

- **Vercel Postgres** is the source of truth. Tables (`hackathons`, `blogs`,
  `blogs_meta`) are created on demand via `CREATE TABLE IF NOT EXISTS`, and the
  `blogs` table is migrated to add `author`/`type` columns if missing.
- **Seed posts** (`blog-seed.ts`) are loaded into the database exactly once
  (tracked by a marker row in `blogs_meta`) so the pre-shipped posts become
  first-class rows the admin can edit and delete; deleted seed posts do not
  reappear.
- **Graceful degradation:** if the database is unavailable, hackathon queries
  return an empty list and blog queries fall back to the in-code seed posts, so
  pages render instead of crashing.
- Blog dates are formatted as `YYYY-MM-DD` in SQL to avoid timezone shifts in the
  admin date input.

---

## 12. SEO, metadata & assets

- Global site metadata, favicon/apple-icon, and Open Graph tags in
  `layout.tsx`.
- Per-page metadata for the blog index, individual posts (with image OG tags),
  and the Fellows page.
- Static assets in `public/`: HackSL logos (standard + dark), team photos, and
  partner logos.

---

## 13. Configuration (environment variables)

| Variable | Purpose |
|----------|---------|
| `HACKSL_ADMIN_USERNAME` | Admin login username (default `admin`) |
| `HACKSL_ADMIN_PASSWORD` | Admin login password |
| `HACKSL_ADMIN_SECRET` | Secret for signing session tokens / Bearer auth |
| `POSTGRES_URL` (et al.) | Vercel Postgres connection |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob access (for image uploads) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Contact-form email |
| `CONTACT_TO` | Contact-form recipient (default `hackslcontact@gmail.com`) |

> **Note:** Default admin credentials exist for local development only. Use
> strong, unique values in production.
