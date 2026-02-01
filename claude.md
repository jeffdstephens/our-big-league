# Fantasy Football League Archive — Claude Code Project Guide

## Project Overview
**League Name:** Our Big League
**Founded:** 1998 (27+ years of history to archive)

A historical archive and nostalgic hub for a private fantasy football league. Built for league owners to revisit past seasons, championships, drafts, and stats. Not a live league management tool — this is a retrospective, community-facing site. Small user base (league owners only, ~10-15 people).

All available league history since 1998 will be included at launch.

---

## Tech Stack

### Target Stack (to be implemented)
- **Frontend:** Vue.js 3 (Composition API with `<script setup>`)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Backend/Serverless:** Vercel Serverless Functions (for API routes, auth callbacks, S3 upload handler)
- **Database:** Supabase (PostgreSQL) — see Architecture section for rationale
- **Auth:** Supabase Auth — Google OAuth first, magic link as secondary. Invite-only via approved_owners table.
- **File Storage:** AWS S3 — dedicated bucket with scoped IAM user credentials. Photos accessed via pre-signed URLs.
- **External API:** CBS Sports API — not in scope for initial build. Will be added later via proxied Vercel Serverless Functions.

### Current Stack (legacy, to be replaced)
The existing codebase uses Vue 2.6, Vue CLI 4.5, Vuetify 2.6, and Vuex 3.x. **Migration approach: rebuild from scratch** using the target stack above, not incremental conversion. Existing components serve as reference for functionality and UI patterns.

---

## Architecture Decisions

### Data Layer: Hybrid Approach
Static historical data (championships, draft recaps, league lore) lives as **JSON files in `public/data/`** — NOT `src/data/`. This distinction matters: files in `public/` are served as static assets and fetched at runtime via `fetch()`, meaning the JSON can be updated and pushed to the repo without any app code change or rebuild. A `git push` is all that's needed and Vercel serves the new file immediately. If these lived in `src/` they would be bundled at build time and baked into the app, defeating the purpose.

Components fetch these files at runtime, e.g. `fetch('/data/championships.json')`. This keeps historical pages fast — no DB round-trip needed.

Dynamic data (user accounts, uploaded photos) goes through **Supabase**.

Why Supabase over Firebase: The historical data is inherently relational — owners, drafts, picks, seasons, placements all relate to each other. PostgreSQL lets us query this cleanly (e.g., "all draft picks by Owner X across every year," "championship history with runner-up info"). Firebase would work but would get awkward as the archive grows.

### Auth
Supabase Auth is the full authentication layer for the entire site — not just database-level auth. It handles login triggers, OAuth flows, token management, session persistence, and is what route protection checks against. Here's how each piece works:

**Login button and social login:** The "Login" button in the nav triggers Supabase Auth's client SDK. **Priority: Google OAuth first** — this is the primary login method to implement. Magic link (passwordless email login) is secondary and can be added later. The Supabase dashboard handles OAuth provider configuration and the SDK manages the redirect flow. The login button should present "Sign in with Google" initially, with magic link added as a future enhancement.

**Invite-only gating — this is critical:** We do NOT want open signups. Only verified league owners should be able to log in. Implementation: maintain an approved emails list in Supabase (a simple `approved_owners` table with an `email` column). When a login attempt comes in, a Vercel Serverless Function in `api/auth/` checks whether the user's email exists in that table BEFORE the auth is allowed to complete. If the email isn't on the list, the login is rejected regardless of whether they have a valid Google or GitHub account. To add a new owner, simply insert their email into the `approved_owners` table — no code change needed.

**Session management:** Once authenticated, Supabase Auth issues a JWT token. The Supabase JS client (`@supabase/supabase-js`) stores and refreshes this token automatically. The app does not manage tokens manually — the client attaches them to every Supabase request behind the scenes.

**Route protection via `useAuth` composable:** The `src/composables/useAuth.js` composable is the gatekeeper for protected pages (e.g., photo upload, owner-only content). It exposes the current auth state (logged in or not, current user info) and provides a guard function that pages or the router can use. If a route requires auth and there's no active session, it redirects to login. If there is a session, the user proceeds. Pages that are public (championships history, draft recaps) don't use this guard — anyone can view them. Pages that require login (photo uploads) do.

**What's public vs. protected:** The archive itself — championships, draft history, general stats — is public. No login needed to browse. Photo upload and any owner-specific features (like "my draft picks across all years") require an authenticated session. This keeps the site useful as a casual reference while reserving the interactive/contribution features for owners.

### File Storage (AWS S3)
Photos uploaded by owners are stored in a dedicated S3 bucket. The bucket has all public access blocked — photos are never publicly accessible via direct URL. Instead, the Vercel Serverless Function in `api/uploads/` generates **pre-signed URLs** to grant temporary access when photos need to be displayed. The IAM user credentials used by the serverless function are scoped to only `PutObject`, `GetObject`, and `DeleteObject` on this bucket — nothing else in the AWS account is accessible.

### CBS Sports API — Future
Not in scope for the initial build. When added later, API calls will be proxied through Vercel Serverless Functions to keep CBS credentials out of client code. Frequently-accessed data will be cached in Supabase to avoid rate limits. The proxy route pattern will be `api/cbs/[endpoint].js`.

### Deployment
Vercel. Connected to the GitHub repo via Vercel's native Git integration. Push to `main` = production deploy. Feature branches get automatic preview deployments. Environment variables (Supabase keys, AWS S3 credentials) are stored in Vercel's environment settings — never in the repo.

---

## Folder Structure

```
/
├── public/                  # Static public assets
│   ├── data/                # Static historical JSON — fetched at runtime, not bundled
│   │   ├── championships.json
│   │   ├── drafts/          # Draft recap data by year (e.g., draft_2019.json)
│   │   └── owners.json      # Static owner info
│   └── images/              # Any static images not tied to uploads
├── src/
│   ├── components/          # Reusable Vue components
│   ├── pages/               # Route-level page components (one per view)
│   ├── layouts/             # Page layouts (default, auth-required, etc.)
│   ├── composables/         # Vue composables (useAuth, useSupabase, etc.)
│   ├── services/            # API client wrappers (Supabase, CBS proxy calls)
│   ├── stores/              # Pinia or Vuex stores if state gets complex
│   └── assets/              # Fonts, global styles
├── api/                     # Vercel Serverless Functions
│   ├── auth/                # Auth-related serverless functions (invite-only gating)
│   └── uploads/             # S3 photo upload handler (generates pre-signed URLs)
├── .env.local               # Local environment variables (gitignored)
├── .env.example             # Template showing required env vars (committed)
├── vercel.json              # Vercel config (routes, rewrites if needed)
└── CLAUDE.md                # This file
```

---

## Environment Variables
All secrets live in `.env.local` (local dev) and Vercel environment settings (production). Never commit secrets to the repo. The `.env.example` file documents what's needed:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=                 # Publishable key — safe for client-side use
SUPABASE_SERVICE_KEY=              # Secret key — server-side only (Serverless Functions)
AWS_ACCESS_KEY_ID=                 # IAM user scoped to the S3 bucket only
AWS_SECRET_ACCESS_KEY=             # IAM user secret — never in client code
AWS_S3_BUCKET_NAME=                # Dedicated bucket for league archive photos
```

---

## Key Conventions for Claude Code
- Use **Composition API** style in all Vue components (`setup()` or `<script setup>`)
- Keep components focused. Pages orchestrate; components render.
- Static historical data lives in `public/data/` and is fetched at runtime via `fetch('/data/...')`. Do NOT import these files into components — that would bundle them at build time and break the ability to update them with a simple push.
- All external API calls go through the `src/services/` layer. Components never call APIs directly.
- CBS API is not in scope for the initial build. When added later, calls will go through `api/cbs/` proxy routes. Never put CBS keys in client code.
- Photo uploads go through the `api/uploads/` serverless function. The function uses AWS SDK with the scoped IAM credentials to write to S3 and returns a pre-signed URL for the client to use when displaying photos. AWS credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) are server-side only — never exposed to client code.
- When adding a new feature, add a route to `vercel.json` if it needs a serverless function.
- Write `.env.example` entries alongside any new environment variable usage.
- Auth is handled entirely by Supabase Auth via the `@supabase/supabase-js` client. Do not build custom token logic or session handling. The `useAuth` composable in `src/composables/` is the only auth interface components should touch.
- Route protection: public pages (history, drafts, championships) need no auth guard. Protected pages (photo uploads, owner-specific views) use the `useAuth` guard. Never hardcode access rules in components — the guard handles it.
- The login button should offer social login options (Google at minimum) plus magic link. The UI for this lives in a shared `LoginModal` or `LoginPage` component.
- The `approved_owners` table in Supabase is the source of truth for who can log in. The serverless function in `api/auth/` gates access against this table. Adding or removing an owner is a database-only change — no code deploy needed.
- Photo uploads: validate file type and size client-side before sending. Server-side validation is mandatory too.

---

## Current Status

### Existing Assets (to preserve during rebuild)
- **Team logos:** 14 images in `src/assets/` (amw.jpg, birrrdy.jpg, bucks.jpg, dumpster-fire.jpg, hampton-ballers.jpg, nbc.png, phunky-cold.jpg, skindeep-ballaz.jpg, smallz.png, ted.jpg, todd.jpg, war-ready.jpg, white-street.jpg, wolf-pack.jpg)
- **League branding:** obl-icon.png, obl-logo.png, logo.svg, trophy.png
- **Team data:** Championship history for 14 teams stored in Vuex (will migrate to `public/data/championships.json`)

### Legacy Pages (reference for rebuild — all in-progress)
- **Home.vue** — Landing page stub
- **Champions.vue** — Functional championship table with two views (Team View, Chronological View), sorting, and color-coded stats. Uses Vuetify data tables.
- **Drafts.vue** — Stub ("Coming soon...")
- **Teams.vue** — Interactive Leaflet map with marker clustering showing team locations
- **About.vue** — Stub ("Coming soon...")

### Legacy Components
- **ChampionsTable.vue** — Sophisticated data table with tabs, dynamic styling, calculated metrics (championship count, appearances, years since last). Good reference for functionality.

### Infrastructure Status
- Supabase project created — URL, Publishable key, and Secret key obtained
- Vercel account created and connected to the GitHub repo — not yet deployed
- AWS S3 bucket created with scoped IAM user — credentials obtained
- No `public/data/` directory created yet
- No `src/composables/` or `src/services/` directories
- No `api/` serverless functions directory
- No database tables created yet in Supabase
- No auth implemented yet
- No environment variable setup (`.env.example` not created)
- No CBS API integration (out of scope for now)

### What's NOT Built Yet
- Vue 3 + Vite + Tailwind project setup
- Static JSON data files in `public/data/`
- Authentication (Supabase Auth with Google OAuth)
- Route protection via useAuth composable
- Photo upload functionality
- Serverless functions for auth gating and S3 uploads

---

## TODOs / Decisions Pending

### Decisions Made
- [x] League name: Our Big League
- [x] League history: All years since 1998 included at launch
- [x] Auth priority: Basic auth first (Supabase + Google OAuth), magic link secondary
- [x] Tech migration: Rebuild from scratch with Vue 3 + Vite + Tailwind (not incremental)
- [x] Data storage: Static JSON in `public/data/` for historical data

### Still Pending
- [ ] Gather league owner email addresses for seeding `approved_owners` table in Supabase
- [ ] Set up Vue 3 + Vite + Tailwind project (replaces current Vue 2 setup)
- [ ] Create `public/data/` directory structure and migrate team/championship data from Vuex to JSON
- [ ] Implement Supabase Auth with Google OAuth
- [ ] Create `.env.example` with required environment variables
- [ ] CBS Sports API — revisit when ready. Will need developer account and API credentials before starting that feature.