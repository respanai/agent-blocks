import { getSupabase } from "./supabase";
import type { Architecture, AppNode, AppEdge, TeamMemberWithEmail, TeamInvite } from "./types";

const SUPER_ADMIN_EMAIL = "frank@respan.ai";

async function getCurrentUser() {
  const { data: { user } } = await getSupabase().auth.getUser();
  return user;
}

async function getCurrentTeamId(): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data } = await getSupabase()
    .from("team_members")
    .select("team_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  return data?.team_id ?? null;
}

async function isSuperAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.email === SUPER_ADMIN_EMAIL;
}

// ─── Architecture CRUD ───────────────────────────────────────

export async function listArchitectures(): Promise<Architecture[]> {
  const teamId = await getCurrentTeamId();
  const query = getSupabase()
    .from("architectures")
    .select("*")
    .order("updated_at", { ascending: false });

  if (teamId) {
    query.eq("team_id", teamId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Architecture[];
}

export async function getArchitecture(id: string): Promise<Architecture | null> {
  const { data, error } = await getSupabase()
    .from("architectures")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Architecture;
}

export async function createArchitecture(): Promise<Architecture> {
  const teamId = await getCurrentTeamId();

  // Free plan limit: 1 architecture per team
  if (teamId && !(await isSuperAdmin())) {
    const { count, error: countError } = await getSupabase()
      .from("architectures")
      .select("*", { count: "exact", head: true })
      .eq("team_id", teamId);

    if (!countError && count !== null && count >= 1) {
      throw new Error("Free plan limit: 1 architecture per team. Upgrade for more.");
    }
  }

  const { data, error } = await getSupabase()
    .from("architectures")
    .insert({
      name: "Untitled Architecture",
      description: "",
      graph: { nodes: [], edges: [] },
      ...(teamId ? { team_id: teamId } : {}),
    })
    .select()
    .single();

  if (error) throw error;
  return data as Architecture;
}

export async function updateArchitecture(
  id: string,
  updates: {
    name?: string;
    description?: string;
    graph?: { nodes: AppNode[]; edges: AppEdge[] };
  }
): Promise<Architecture> {
  const { data, error } = await getSupabase()
    .from("architectures")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Architecture;
}

export async function deleteArchitecture(id: string): Promise<void> {
  const { data, error } = await getSupabase()
    .from("architectures")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error("Delete failed — architecture not found or permission denied.");
  }
}

export async function toggleArchitecturePublic(
  id: string,
  isPublic: boolean
): Promise<void> {
  const { error } = await getSupabase()
    .from("architectures")
    .update({ is_public: isPublic })
    .eq("id", id);

  if (error) throw error;
}

export async function getPublicArchitectures(): Promise<Architecture[]> {
  const { data, error } = await getSupabase()
    .from("architectures")
    .select("*")
    .eq("is_public", true)
    .order("views", { ascending: false });

  if (error) throw error;
  return data as Architecture[];
}

export async function incrementArchitectureViews(id: string): Promise<void> {
  await getSupabase().rpc("increment_architecture_views", { arch_id: id });
}

// ─── Team Management ─────────────────────────────────────────

export async function createTeam(name: string): Promise<{ id: string; name: string }> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  // Free plan limit: 1 team (create or join) — unless super admin
  if (user.email !== SUPER_ADMIN_EMAIL) {
    const { count, error: countError } = await getSupabase()
      .from("team_members")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (!countError && count !== null && count >= 1) {
      throw new Error("Free plan limit: 1 team. Leave your current team first.");
    }
  }

  // Create team + add creator as admin in one RPC call
  // (Can't do INSERT then SELECT — user isn't a member yet so SELECT RLS fails)
  const { data, error: rpcError } = await getSupabase()
    .rpc("create_team_with_admin", { team_name: name });

  if (rpcError) throw rpcError;

  return { id: data.id, name: data.name };
}

export async function leaveTeam(teamId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await getSupabase()
    .from("team_members")
    .delete()
    .eq("team_id", teamId)
    .eq("user_id", user.id);

  if (error) throw error;
}

// ─── Invites ─────────────────────────────────────────────────

export async function inviteToTeam(teamId: string, email: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await getSupabase()
    .from("team_invites")
    .insert({
      team_id: teamId,
      email: email.toLowerCase().trim(),
      invited_by: user.id,
    });

  if (error) {
    if (error.code === "23505") {
      throw new Error("This email has already been invited to this team.");
    }
    throw error;
  }
}

export async function acceptInvite(inviteId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  // Free plan limit: 1 team — unless super admin
  if (user.email !== SUPER_ADMIN_EMAIL) {
    const { count, error: countError } = await getSupabase()
      .from("team_members")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (!countError && count !== null && count >= 1) {
      throw new Error("Free plan limit: 1 team. Leave your current team first.");
    }
  }

  // Get the invite
  const { data: invite, error: inviteError } = await getSupabase()
    .from("team_invites")
    .select("*")
    .eq("id", inviteId)
    .single();

  if (inviteError || !invite) throw new Error("Invite not found");

  // Add user to team as member
  const { error: memberError } = await getSupabase()
    .from("team_members")
    .insert({
      team_id: invite.team_id,
      user_id: user.id,
      role: "member",
    });

  if (memberError) throw memberError;

  // Mark invite as accepted
  await getSupabase()
    .from("team_invites")
    .update({ status: "accepted" })
    .eq("id", inviteId);
}

export async function declineInvite(inviteId: string): Promise<void> {
  const { error } = await getSupabase()
    .from("team_invites")
    .update({ status: "declined" })
    .eq("id", inviteId);

  if (error) throw error;
}

export async function listTeamMembers(teamId: string): Promise<TeamMemberWithEmail[]> {
  const { data, error } = await getSupabase()
    .rpc("get_team_members_with_email", { p_team_id: teamId });

  if (error) throw error;
  return data as TeamMemberWithEmail[];
}

export async function listTeamInvites(teamId: string): Promise<TeamInvite[]> {
  const { data, error } = await getSupabase()
    .from("team_invites")
    .select("*, teams(name)")
    .eq("team_id", teamId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as TeamInvite[];
}

export async function revokeInvite(inviteId: string): Promise<void> {
  const { error } = await getSupabase()
    .from("team_invites")
    .delete()
    .eq("id", inviteId);

  if (error) throw error;
}
