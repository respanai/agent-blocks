"use client";

import { useState } from "react";
import { createTeam } from "@/lib/api";

interface CreateTeamFormProps {
  onCreated: () => Promise<void>;
}

export function CreateTeamForm({ onCreated }: CreateTeamFormProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
    setLoading(true);

    try {
      await createTeam(name.trim());
      await onCreated();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-surface-light bg-surface p-10">
          <h2 className="text-xl font-mono font-bold text-stone-800 mb-2">
            Create a Team
          </h2>
          <p className="text-sm text-stone-500 font-sans mb-8">
            Teams let you collaborate on agent architectures with others.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-stone-500 mb-2">
                Team Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg bg-surface-light border border-surface-light px-4 py-3 text-base text-stone-800 focus:border-selected focus:outline-none"
                placeholder="e.g. My AI Lab"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-node-end/30 bg-node-end/10 px-4 py-3 text-sm text-node-end">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full rounded-lg bg-selected/20 px-5 py-3 font-mono text-base text-selected hover:bg-selected/30 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-selected border-t-transparent" />
                  Creating...
                </span>
              ) : (
                "Create Team"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
