"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listArchitectures, deleteArchitecture } from "@/lib/api";
import { ArchitectureCard } from "@/components/ArchitectureCard";
import { AuthGuard } from "@/components/AuthGuard";
import { CreateTeamForm } from "@/components/CreateTeamForm";
import { PendingInvites } from "@/components/PendingInvites";
import { TeamPanel } from "@/components/TeamPanel";
import { useAuth } from "@/lib/useAuth";
import type { Architecture } from "@/lib/types";

function DashboardContent() {
  const { user, team, role, pendingInvites, isSuperAdmin, signOut, refreshAuth } = useAuth();
  const [architectures, setArchitectures] = useState<Architecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTeam, setShowCreateTeam] = useState(false);

  useEffect(() => {
    if (team) {
      listArchitectures()
        .then(setArchitectures)
        .catch((err) => console.error("Failed to load architectures:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [team]);

  const handleDelete = async (id: string) => {
    try {
      await deleteArchitecture(id);
      setArchitectures((archs) => archs.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Failed to delete architecture. You may not have permission.");
    }
  };

  const handleTeamCreated = async () => {
    await refreshAuth();
  };

  const canCreateArchitecture = isSuperAdmin || architectures.length < 1;

  // ─── Branch A: No team + pending invites ────────────────────
  if (!team && pendingInvites.length > 0 && !showCreateTeam) {
    return (
      <div className="min-h-screen p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-mono font-bold text-stone-800">
            Agent Architect
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-500 font-mono">{user?.email}</span>
            <button
              onClick={signOut}
              className="rounded bg-surface-light px-3 py-1.5 font-mono text-xs text-stone-600 hover:text-stone-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
        <PendingInvites
          invites={pendingInvites}
          onAction={refreshAuth}
          onCreateTeam={() => setShowCreateTeam(true)}
        />
      </div>
    );
  }

  // ─── Branch B: No team + no invites (or chose to create) ────
  if (!team) {
    return (
      <div className="min-h-screen p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-mono font-bold text-stone-800">
            Agent Architect
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-500 font-mono">{user?.email}</span>
            <button
              onClick={signOut}
              className="rounded bg-surface-light px-3 py-1.5 font-mono text-xs text-stone-600 hover:text-stone-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
        <CreateTeamForm onCreated={handleTeamCreated} />
        {showCreateTeam && pendingInvites.length > 0 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowCreateTeam(false)}
              className="text-sm text-stone-400 font-mono hover:text-selected transition-colors"
            >
              Back to invitations
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── Branch C: Has team (current flow, enhanced) ────────────
  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-mono font-bold text-stone-800">
            {team.name}
          </h1>
          <p className="text-sm text-stone-500 mt-1 font-sans">
            Agent Architect
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-stone-500 font-mono">{user?.email}</div>
            <div className="text-[10px] text-stone-400 font-mono">
              {role === "admin" ? "Admin" : "Member"}
              {isSuperAdmin && " (Super)"}
            </div>
          </div>
          <button
            onClick={signOut}
            className="rounded bg-surface-light px-3 py-1.5 font-mono text-xs text-stone-600 hover:text-stone-800 transition-colors"
          >
            Sign Out
          </button>
          {canCreateArchitecture ? (
            <Link
              href="/new"
              className="rounded bg-selected/20 px-4 py-2 font-mono text-sm text-selected hover:bg-selected/30 transition-colors"
            >
              + New Architecture
            </Link>
          ) : (
            <span
              className="rounded bg-surface-light px-4 py-2 font-mono text-sm text-stone-400 cursor-default"
              title="Free plan: 1 architecture per team"
            >
              + New Architecture
            </span>
          )}
        </div>
      </div>

      {/* Team panel */}
      {role && (
        <TeamPanel team={team} role={role} isSuperAdmin={isSuperAdmin} />
      )}

      {/* Architecture grid */}
      {loading ? (
        <div className="flex items-center gap-3 justify-center py-20">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-selected border-t-transparent" />
          <span className="font-mono text-sm text-stone-500">Loading...</span>
        </div>
      ) : architectures.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-stone-400 font-sans">No architectures yet.</p>
          <Link
            href="/new"
            className="inline-block mt-4 rounded bg-selected/20 px-4 py-2 font-mono text-sm text-selected hover:bg-selected/30 transition-colors"
          >
            Create your first architecture
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {architectures.map((arch) => (
            <ArchitectureCard
              key={arch.id}
              architecture={arch}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
