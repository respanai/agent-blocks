"use client";

import { useEffect, useState } from "react";
import {
  listTeamMembers,
  listTeamInvites,
  inviteToTeam,
  revokeInvite,
  leaveTeam,
} from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import type { Team, TeamMemberWithEmail, TeamInvite } from "@/lib/types";

interface TeamPanelProps {
  team: Team;
  role: string;
  isSuperAdmin: boolean;
}

export function TeamPanel({ team, role, isSuperAdmin }: TeamPanelProps) {
  const { refreshAuth } = useAuth();
  const [members, setMembers] = useState<TeamMemberWithEmail[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);

  const isAdmin = role === "admin" || isSuperAdmin;

  useEffect(() => {
    if (expanded) {
      loadData();
    }
  }, [expanded, team.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      const [m, i] = await Promise.all([
        listTeamMembers(team.id),
        isAdmin ? listTeamInvites(team.id) : Promise.resolve([]),
      ]);
      setMembers(m);
      setInvites(i);
    } catch (err) {
      console.error("Failed to load team data:", err);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setError(null);
    setSuccess(null);
    setInviteLoading(true);

    try {
      await inviteToTeam(team.id, inviteEmail);
      setSuccess(`Invite sent to ${inviteEmail}`);
      setInviteEmail("");
      await loadData();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRevoke = async (id: string) => {
    setError(null);
    try {
      await revokeInvite(id);
      await loadData();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave this team?")) return;

    setLeaveLoading(true);
    try {
      await leaveTeam(team.id);
      await refreshAuth();
    } catch (err) {
      setError((err as Error).message);
      setLeaveLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-surface-light bg-surface mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="font-mono text-sm text-stone-600">
          Team Settings
        </span>
        <svg
          className={`w-4 h-4 text-stone-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-surface-light pt-4">
          {error && (
            <div className="rounded-lg border border-node-end/30 bg-node-end/10 px-4 py-3 text-sm text-node-end">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-node-start/30 bg-node-start/10 px-4 py-3 text-sm text-node-start">
              {success}
            </div>
          )}

          {/* Members list */}
          <div>
            <h3 className="font-mono text-xs text-stone-400 uppercase tracking-wider mb-3">
              Members
            </h3>
            <div className="space-y-2">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg bg-surface-light px-4 py-2"
                >
                  <span className="text-sm text-stone-700 font-mono">
                    {m.email}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono uppercase">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Invite form (admin only) */}
          {isAdmin && (
            <div>
              <h3 className="font-mono text-xs text-stone-400 uppercase tracking-wider mb-3">
                Invite Member
              </h3>
              <form onSubmit={handleInvite} className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  placeholder="email@example.com"
                  className="flex-1 rounded-lg bg-surface-light border border-surface-light px-4 py-2 text-sm text-stone-800 focus:border-selected focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={inviteLoading || !inviteEmail.trim()}
                  className="rounded-lg bg-selected/20 px-4 py-2 font-mono text-xs text-selected hover:bg-selected/30 transition-colors disabled:opacity-50"
                >
                  {inviteLoading ? "..." : "Invite"}
                </button>
              </form>
            </div>
          )}

          {/* Pending invites (admin only) */}
          {isAdmin && invites.length > 0 && (
            <div>
              <h3 className="font-mono text-xs text-stone-400 uppercase tracking-wider mb-3">
                Pending Invites
              </h3>
              <div className="space-y-2">
                {invites.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between rounded-lg bg-surface-light px-4 py-2"
                  >
                    <span className="text-sm text-stone-700 font-mono">
                      {inv.email}
                    </span>
                    <button
                      onClick={() => handleRevoke(inv.id)}
                      className="text-[10px] text-node-end font-mono uppercase hover:underline"
                    >
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leave team (for non-admin members, or anyone really) */}
          <div className="pt-2 border-t border-surface-light">
            <button
              onClick={handleLeave}
              disabled={leaveLoading}
              className="text-xs text-node-end font-mono hover:underline disabled:opacity-50"
            >
              {leaveLoading ? "Leaving..." : "Leave Team"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
