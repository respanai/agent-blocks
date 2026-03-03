"use client";

import { type NodeProps, type Node } from "@xyflow/react";
import type { StartNodeData } from "@/lib/types";
import { NodeHandles } from "./NodeHandles";

type StartNode = Node<StartNodeData, "start">;

export function StartNode({ data, selected }: NodeProps<StartNode>) {
  return (
    <div
      className={`rounded-lg border-2 bg-surface px-4 py-3 min-w-[160px] ${
        selected ? "border-selected shadow-[0_0_12px_rgba(196,163,90,0.4)]" : "border-node-start"
      }`}
    >
      <NodeHandles target={false} />
      <div className="font-mono text-sm font-bold uppercase tracking-wider text-node-start">
        {data.label || "START"}
      </div>
      {data.description && (
        <div className="mt-1 font-sans text-xs text-stone-500">
          {data.description}
        </div>
      )}
    </div>
  );
}
