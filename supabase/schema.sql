-- Our Big League - Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- ============================================
-- Table: draft_locations
-- Cities where drafts have been held
-- ============================================
CREATE TABLE draft_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL UNIQUE,
  lat decimal(9,6),
  lng decimal(9,6),
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- Table: teams
-- Core team information with owner details
-- ============================================
CREATE TABLE teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  location text,
  lat decimal(9,6),
  lng decimal(9,6),
  logo text,
  owner_first_name text,
  owner_last_name text,
  owner_email text,
  owner_phone text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- Table: team_aliases
-- Maps historical team names to current teams
-- ============================================
CREATE TABLE team_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  alias text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Index for faster alias lookups
CREATE INDEX idx_team_aliases_alias ON team_aliases(alias);

-- ============================================
-- Table: seasons
-- Year-by-year championship results
-- ============================================
CREATE TABLE seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL UNIQUE,
  season_number integer NOT NULL,
  draft_location_id uuid REFERENCES draft_locations(id),
  champion_id uuid REFERENCES teams(id),
  champion_display_name text,
  runner_up_id uuid REFERENCES teams(id),
  runner_up_display_name text,
  is_co_championship boolean DEFAULT false,
  co_champion_id uuid REFERENCES teams(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Index for year lookups
CREATE INDEX idx_seasons_year ON seasons(year);

-- ============================================
-- Table: approved_owners
-- Links teams to auth - uses teams.owner_email
-- ============================================
CREATE TABLE approved_owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL UNIQUE REFERENCES teams(id) ON DELETE CASCADE,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- Table: draft_photos (for future use)
-- Photos uploaded by owners for draft pages
-- ============================================
CREATE TABLE draft_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  s3_key text NOT NULL,
  filename text,
  caption text,
  uploaded_by uuid REFERENCES approved_owners(id),
  uploaded_at timestamptz DEFAULT now(),
  is_approved boolean DEFAULT true
);

-- Index for fetching photos by season
CREATE INDEX idx_draft_photos_season ON draft_photos(season_id);

-- ============================================
-- Row Level Security (RLS) Policies
-- Public read, authenticated write
-- ============================================

-- Enable RLS on all tables
ALTER TABLE draft_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE approved_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE draft_photos ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access" ON draft_locations FOR SELECT USING (true);
CREATE POLICY "Public read access" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read access" ON team_aliases FOR SELECT USING (true);
CREATE POLICY "Public read access" ON seasons FOR SELECT USING (true);
CREATE POLICY "Public read access" ON draft_photos FOR SELECT USING (is_approved = true);

-- Authenticated write access (for future admin features)
CREATE POLICY "Authenticated insert" ON draft_locations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update" ON draft_locations FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated insert" ON teams FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update" ON teams FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated insert" ON team_aliases FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update" ON team_aliases FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated insert" ON seasons FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update" ON seasons FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated insert" ON draft_photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update" ON draft_photos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete" ON draft_photos FOR DELETE USING (auth.role() = 'authenticated');
