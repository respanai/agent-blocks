"use client";

import { useState } from "react";
import { acceptInvite, declineInvite } from "@/lib/api";
import type { TeamInvite } from "@/lib/types";

interface PendingInvitesProps {
  invites: TeamInvite[];
  onAction: () => Promise<void>;
  onCreateTeam: () => void;
}

export function PendingInvites({ invites, onAction, onCreateTeam }: PendingInvitesProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async (id: string) => {
    setError(null);
    setLoadingId(id);
    try {
      await acceptInvite(id);
      await onAction();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDecline = async (id: string) => {
    setError(null);
    setLoadingId(id);
    try {
      await declineInvite(id);
      await onAction();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-xl font-mono font-bold text-stone-800 mb-2">
          Team Invitations
        </h2>
        <p className="text-sm text-stone-500 font-sans mb-6">
          You&apos;ve been invited to join a team.
        </p>

        {error && (
          <div className="rounded-lg border border-node-end/30 bg-node-end/10 px-4 py-3 text-sm text-node-end">
            {error}
          </div>
        )}

        {invites.map((invite) => (
          <div
            key={invite.id}
            className="rounded-xl border border-surface-light bg-surface p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono font-bold text-stone-800">
                  {invite.teams?.name ?? "Unknown Team"}
                </p>
                <p className="text-xs text-stone-400 font-mono mt-1">
                  Invited {new Date(invite.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecline(invite.id)}
                  disabled={loadingId === invite.id}
                  className="rounded-lg bg-surface-light px-4 py-2 font-mono text-xs text-stone-600 hover:text-stone-800 transition-colors disabled:opacity-50"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleAccept(invite.id)}
                  disabled={loadingId === invite.id}
                  className="rounded-lg bg-selected/20 px-4 py-2 font-mono text-xs text-selected hover:bg-selected/30 transition-colors disabled:opacity-50"
                >
                  {loadingId === invite.id ? "..." : "Accept"}
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="text-center pt-4">
          <button
            onClick={onCreateTeam}
            className="text-sm text-stone-400 font-mono hover:text-selected transition-colors"
          >
            Or create your own team
          </button>
        </div>
      </div>
    </div>
  );
}
