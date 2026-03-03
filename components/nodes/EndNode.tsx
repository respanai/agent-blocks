"use client";

import { type NodeProps, type Node } from "@xyflow/react";
import type { EndNodeData } from "@/lib/types";
import { NodeHandles } from "./NodeHandles";

type EndNode = Node<EndNodeData, "end">;

export function EndNode({ data, selected }: NodeProps<EndNode>) {
  return (
    <div
      className={`rounded-lg border-2 bg-surface px-4 py-3 min-w-[160px] ${
        selected ? "border-selected shadow-[0_0_12px_rgba(196,163,90,0.4)]" : "border-node-end"
      }`}
    >
      <NodeHandles source={false} />
      <div className="font-mono text-sm font-bold uppercase tracking-wider text-node-end">
        {data.label || "END"}
      </div>
      {data.description && (
        <div className="mt-1 font-sans text-xs text-stone-500">
          {data.description}
        </div>
      )}
    </div>
  );
}
