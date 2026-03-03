"use client";

import Link from "next/link";
import type { Architecture } from "@/lib/types";

interface ArchitectureCardProps {
  architecture: Architecture;
  onDelete: (id: string) => void;
}

export function ArchitectureCard({ architecture, onDelete }: ArchitectureCardProps) {
  const nodeCount = architecture.graph?.nodes?.length || 0;
  const edgeCount = architecture.graph?.edges?.length || 0;
  const updatedAt = new Date(architecture.updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="group rounded-lg border border-surface-light bg-surface p-4 hover:border-selected/40 transition-colors">
      <Link href={`/${architecture.id}`} className="block">
        <h3 className="font-sans text-sm font-semibold text-stone-800 group-hover:text-selected transition-colors">
          {architecture.name}
        </h3>
        {architecture.description && (
          <p className="mt-1 text-xs text-stone-500 line-clamp-2">
            {architecture.description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-3 text-[10px] font-mono text-stone-400">
          <span>{nodeCount} states</span>
          <span>{edgeCount} transitions</span>
        </div>
        <div className="mt-1 text-[10px] text-stone-400">{updatedAt}</div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (confirm(`Delete "${architecture.name}"?`)) {
            onDelete(architecture.id);
          }
        }}
        className="mt-2 text-[10px] text-stone-400 hover:text-node-end transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
