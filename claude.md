# Fantasy Football League Archive — Claude Code Project Guide

## Project Overview
**League Name:** Our Big League
**Founded:** 1998 (27+ years of history to archive)

A historical archive and nostalgic hub for a private fantasy football league. Built for league owners to revisit past seasons, championships, drafts, and stats. Not a live league management tool — this is a retrospective, community-facing site. Small user base (league owners only, ~10-15 people).

All available league history since 1998 will be included at launch.

---

## Tech Stack

### Current Stack
- **Frontend:** Vue.js 3 (Composition API with `<script setup>`)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Backend/Serverless:** Vercel Serverless Functions (for API routes, auth callbacks, S3 upload handler)
- **Database:** Supabase (PostgreSQL) — all league data (teams, seasons, championships)
- **Auth:** Supabase Auth — Google OAuth first, magic link as secondary. Invite-only via approved_owners table (not yet implemented)
- **File Storage:** AWS S3 — dedicated bucket with scoped IAM user credentials. Photos accessed via pre-signed URLs (not yet implemented)
- **External API:** CBS Sports API — not in scope for initial build. Will be added later via proxied Vercel Serverless Functions

---

## Architecture Decisions

### Data Layer: Supabase PostgreSQL
All league data lives in **Supabase PostgreSQL**, including teams, seasons, championships, and draft locations. This provides:
- Easy data updates via Supabase dashboard (no code changes needed)
- Proper relational data model with foreign keys
- Support for future features (user accounts, photos, owner-specific content)
- Clean queries for complex data relationships (e.g., "all draft picks by Owner X," "championship history with runner-up info")

**Database Schema:**
- `teams` — Team info with owner details, location coordinates for map, active/defunct status
- `team_aliases` — Maps historical team names to current teams (e.g., "Real Stoutboogee" → "Stout")
- `draft_locations` — Cities where drafts have been held, with coordinates
- `seasons` — Year-by-year results with champion, runner-up, draft location, notes
- `approved_owners` — Links to teams table for auth gating (future feature)
- `draft_photos` — Photos uploaded by owners for each draft year (future feature)

**Service Layer:**
- `src/services/teamService.js` — Team CRUD operations and stats calculation
- `src/services/seasonService.js` — Season/championship queries

**Composables:**
- `src/composables/useTeamData.js` — Fetches teams with calculated stats
- `src/composables/useChampionshipData.js` — Fetches seasons, draft locations, championship stats and tiers

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
│   └── images/              # Any static images not tied to uploads
├── src/
│   ├── assets/              # Team logos, league branding images
│   ├── components/          # Reusable Vue components
│   │   └── champions/       # Championship-related components
│   ├── composables/         # Vue composables (useSupabase, useTeamData, useChampionshipData)
│   ├── pages/               # Route-level page components (one per view)
│   └── services/            # API client wrappers (teamService, seasonService)
├── supabase/                # Database setup scripts
│   ├── schema.sql           # Table definitions, RLS policies
│   └── seed.sql             # Initial data (teams, seasons, draft locations)
├── api/                     # Vercel Serverless Functions (future)
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
# Supabase - Client-side (VITE_ prefix required for Vite to expose to browser)
VITE_SUPABASE_URL=                 # Full Supabase project URL
VITE_SUPABASE_ANON_KEY=            # Publishable key — safe for client-side use

# Supabase - Server-side only (for serverless functions)
SUPABASE_SERVICE_KEY=              # Secret key — server-side only (Serverless Functions)

# AWS S3 - Server-side only (future photo uploads)
AWS_ACCESS_KEY_ID=                 # IAM user scoped to the S3 bucket only
AWS_SECRET_ACCESS_KEY=             # IAM user secret — never in client code
AWS_S3_BUCKET_NAME=                # Dedicated bucket for league archive photos
```

**Important:** Vite requires the `VITE_` prefix for environment variables to be accessible in client-side code. Server-side variables (used in Vercel Serverless Functions) do not need this prefix.

---

## Key Conventions for Claude Code
- **Always create a feature branch before making code changes.** Never commit directly to `main`. Use descriptive branch names like `feature/champions-page` or `fix/map-markers`.
- Use **Composition API** style in all Vue components (`setup()` or `<script setup>`)
- Keep components focused. Pages orchestrate; components render.
- **Data fetching:** All database queries go through the `src/services/` layer (teamService.js, seasonService.js). Pages use composables (useTeamData, useChampionshipData) which call these services. Components never call Supabase directly.
- **Data updates:** Update data via Supabase dashboard — no code changes needed for adding new seasons, teams, etc.
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

### Completed
- **Vue 3 + Vite + Tailwind CSS** project setup
- **Supabase integration** — database schema and seed data scripts in `supabase/` folder
- **Service layer** — teamService.js, seasonService.js for all database queries
- **Composables** — useSupabase.js, useTeamData.js, useChampionshipData.js
- **Pages:**
  - ChampionsPage.vue — Stats cards, history table, championship summary by tier
  - DraftsPage.vue — Interactive map with draft location pins, linked to detail pages
  - DraftDetailPage.vue — Individual draft year pages with prev/next navigation
  - TeamsPage.vue — Interactive Leaflet map with team markers and popups
- **Components:**
  - ChampionshipStats.vue — 5 stats cards (Total Seasons, Unique Champions, Most Titles, Longest Drought, No Titles)
  - ChampionshipHistory.vue — Sortable history table with color-coded champion/runner-up
  - ChampionshipSummary.vue — Teams grouped by championship count

### Assets
- **Team logos:** 14 images in `src/assets/`
- **League branding:** obl-icon.png, obl-logo.png, logo.svg, trophy.png

### Infrastructure Status
- Supabase project created with URL, publishable key, and secret key
- Database schema and seed SQL scripts ready (need to run in Supabase SQL Editor)
- Vercel account connected to GitHub repo
- AWS S3 bucket created with scoped IAM credentials
- Environment variables configured in `.env.local`

### What's NOT Built Yet
- Run database schema and seed scripts in Supabase (manual step required)
- Authentication (Supabase Auth with Google OAuth)
- Route protection via useAuth composable
- Photo upload functionality (S3 integration)
- Serverless functions for auth gating and S3 uploads
- CBS API integration (out of scope for now)

---

## TODOs / Decisions Pending

### Decisions Made
- [x] League name: Our Big League
- [x] League history: All years since 1998 included at launch
- [x] Auth priority: Basic auth first (Supabase + Google OAuth), magic link secondary
- [x] Tech migration: Rebuild from scratch with Vue 3 + Vite + Tailwind (not incremental)
- [x] Data storage: Supabase PostgreSQL for all league data (teams, seasons, championships)

### Completed
- [x] Vue 3 + Vite + Tailwind project setup
- [x] Supabase database schema design
- [x] Migrate championship/team data from JSON to Supabase
- [x] Create service layer and composables for data fetching
- [x] Champions page with stats, history, and summary
- [x] Drafts page with interactive map
- [x] Teams page with interactive map

### Still Pending
- [ ] **Run database setup** — Execute `supabase/schema.sql` then `supabase/seed.sql` in Supabase SQL Editor
- [ ] Gather league owner email addresses for seeding `approved_owners` table
- [ ] Implement Supabase Auth with Google OAuth
- [ ] Create `.env.example` with required environment variables
- [ ] Photo upload functionality
- [ ] CBS Sports API — revisit when ready. Will need developer account and API credentials before starting that feature.