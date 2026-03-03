"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { getSupabase } from "./supabase";
import type { User, Session } from "@supabase/supabase-js";
import type { Team, TeamInvite } from "./types";

const SUPER_ADMIN_EMAIL = "frank@respan.ai";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  team: Team | null;
  role: string | null;
  pendingInvites: TeamInvite[];
  loading: boolean;
  isSuperAdmin: boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  team: null,
  role: null,
  pendingInvites: [],
  loading: true,
  isSuperAdmin: false,
  signOut: async () => {},
  refreshAuth: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [pendingInvites, setPendingInvites] = useState<TeamInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const initialLoadDone = useRef(false);

  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

  const fetchPendingInvites = useCallback(async (email: string) => {
    try {
      const { data } = await getSupabase()
        .from("team_invites")
        .select("*, teams(name)")
        .eq("email", email)
        .eq("status", "pending");

      setPendingInvites((data as TeamInvite[]) ?? []);
    } catch {
      setPendingInvites([]);
    }
  }, []);

  const fetchTeam = useCallback(async (userId: string) => {
    try {
      const { data, error } = await getSupabase()
        .from("team_members")
        .select("team_id, role, teams(id, name)")
        .eq("user_id", userId)
        .limit(1)
        .single();

      if (error || !data) {
        setTeam(null);
        setRole(null);
      } else {
        const teamData = data.teams as unknown as { id: string; name: string };
        setTeam({ id: teamData.id, name: teamData.name });
        setRole(data.role);
      }
    } catch {
      setTeam(null);
      setRole(null);
    }
  }, []);

  const loadUserData = useCallback(async (u: User) => {
    await Promise.all([
      fetchTeam(u.id),
      u.email ? fetchPendingInvites(u.email) : Promise.resolve(),
    ]);
    setLoading(false);
  }, [fetchTeam, fetchPendingInvites]);

  const refreshAuth = useCallback(async () => {
    if (user) {
      await loadUserData(user);
    }
  }, [user, loadUserData]);

  useEffect(() => {
    const supabase = getSupabase();

    // getSession handles the initial load
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        loadUserData(s.user).then(() => {
          initialLoadDone.current = true;
        });
      } else {
        setLoading(false);
        initialLoadDone.current = true;
      }
    });

    // onAuthStateChange — skip INITIAL_SESSION (already handled above)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "INITIAL_SESSION") return;

      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        loadUserData(s.user);
      } else {
        setTeam(null);
        setRole(null);
        setPendingInvites([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signOut = async () => {
    await getSupabase().auth.signOut();
    setUser(null);
    setSession(null);
    setTeam(null);
    setRole(null);
    setPendingInvites([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        team,
        role,
        pendingInvites,
        loading,
        isSuperAdmin,
        signOut,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
