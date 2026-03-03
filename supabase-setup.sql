-- =====================================================
-- Agent Architect: Auth + Teams Setup
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- 1. Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (team_id, user_id)
);

-- 3. Add team_id column to architectures
ALTER TABLE architectures
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;

-- 4. Drop old permissive policies (if they exist)
DROP POLICY IF EXISTS "Allow all" ON architectures;
DROP POLICY IF EXISTS "Allow all reads" ON architectures;
DROP POLICY IF EXISTS "Allow all inserts" ON architectures;
DROP POLICY IF EXISTS "Allow all updates" ON architectures;
DROP POLICY IF EXISTS "Allow all deletes" ON architectures;

-- 5. Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE architectures ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- IMPORTANT: Helper function to avoid infinite recursion
-- All policies use this instead of querying team_members directly
-- =====================================================
CREATE OR REPLACE FUNCTION get_my_team_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT team_id FROM team_members WHERE user_id = auth.uid();
$$;

-- 6. RLS policies for teams
CREATE POLICY "Users can view their teams"
  ON teams FOR SELECT
  USING (id IN (SELECT get_my_team_ids()));

-- Any authenticated user can create a team
CREATE POLICY "Authenticated users can create teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Invited users can see the team name (for invite display)
-- NOTE: uses auth.jwt() instead of auth.users to avoid permission errors
CREATE POLICY "Invited users can view team"
  ON teams FOR SELECT
  USING (
    id IN (
      SELECT team_id FROM team_invites
      WHERE email = (auth.jwt() ->> 'email')
        AND status = 'pending'
    )
  );

-- 7. RLS policies for team_members
--    Uses simple user_id check to avoid self-referencing recursion.
--    To see other team members, use get_team_members_with_email() RPC.
CREATE POLICY "Users can view own memberships"
  ON team_members FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert themselves (for accepting invites / creating teams)
CREATE POLICY "Users can add themselves to teams"
  ON team_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can remove themselves from teams
CREATE POLICY "Users can remove themselves"
  ON team_members FOR DELETE
  USING (user_id = auth.uid());

-- 8. RLS policies for architectures
CREATE POLICY "Users can view team architectures"
  ON architectures FOR SELECT
  USING (team_id IN (SELECT get_my_team_ids()));

CREATE POLICY "Users can insert team architectures"
  ON architectures FOR INSERT
  WITH CHECK (team_id IN (SELECT get_my_team_ids()));

CREATE POLICY "Users can update team architectures"
  ON architectures FOR UPDATE
  USING (team_id IN (SELECT get_my_team_ids()));

CREATE POLICY "Users can delete team architectures"
  ON architectures FOR DELETE
  USING (team_id IN (SELECT get_my_team_ids()));

-- =====================================================
-- Team Invites
-- =====================================================

-- 9. Create team_invites table
CREATE TABLE IF NOT EXISTS team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (team_id, email)
);
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;

-- 10. RLS policies for team_invites
-- NOTE: all email checks use auth.jwt() instead of auth.users

-- Team admins can view invites; users can see invites addressed to them
CREATE POLICY "Team admins can view invites"
  ON team_invites FOR SELECT
  USING (
    team_id IN (SELECT get_my_team_ids())
    OR email = (auth.jwt() ->> 'email')
  );

-- Team admins can create invites
CREATE POLICY "Team admins can insert invites"
  ON team_invites FOR INSERT
  WITH CHECK (
    team_id IN (SELECT get_my_team_ids())
  );

-- Users can update invites addressed to them (accept/decline)
CREATE POLICY "Users can update their own invites"
  ON team_invites FOR UPDATE
  USING (
    email = (auth.jwt() ->> 'email')
  );

-- Team admins can delete (revoke) invites for their team
CREATE POLICY "Team admins can delete invites"
  ON team_invites FOR DELETE
  USING (
    team_id IN (SELECT get_my_team_ids())
  );

-- =====================================================
-- RPC: Create team + add creator as admin atomically
-- (INSERT into teams triggers SELECT RLS, but user isn't
--  a member yet, so we use SECURITY DEFINER to bypass)
-- =====================================================
CREATE OR REPLACE FUNCTION create_team_with_admin(team_name TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_team_id UUID;
  result JSON;
BEGIN
  -- Create the team
  INSERT INTO teams (name) VALUES (team_name)
  RETURNING id INTO new_team_id;

  -- Add the caller as admin
  INSERT INTO team_members (team_id, user_id, role)
  VALUES (new_team_id, auth.uid(), 'admin');

  -- Return the team
  SELECT json_build_object('id', new_team_id, 'name', team_name)
  INTO result;

  RETURN result;
END;
$$;

-- =====================================================
-- RPC: Get team members with emails (SECURITY DEFINER)
-- =====================================================
CREATE OR REPLACE FUNCTION get_team_members_with_email(p_team_id UUID)
RETURNS TABLE (id UUID, user_id UUID, role TEXT, email TEXT, created_at TIMESTAMPTZ)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT tm.id, tm.user_id, tm.role, u.email, tm.created_at
  FROM team_members tm
  JOIN auth.users u ON u.id = tm.user_id
  WHERE tm.team_id = p_team_id
    AND p_team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    );
$$;

-- =====================================================
-- Public Architectures (Share to Showcases)
-- =====================================================

-- Add is_public column to architectures
ALTER TABLE architectures
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Add views counter
ALTER TABLE architectures
  ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Anyone (including unauthenticated) can view public architectures
CREATE POLICY "Anyone can view public architectures"
  ON architectures FOR SELECT
  USING (is_public = true);

-- RPC to increment views (SECURITY DEFINER so anyone can call it)
CREATE OR REPLACE FUNCTION increment_architecture_views(arch_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE architectures
  SET views = COALESCE(views, 0) + 1
  WHERE id = arch_id AND is_public = true;
$$;
