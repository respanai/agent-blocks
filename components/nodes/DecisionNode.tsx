"use client";

import { type NodeProps, type Node, useEdges } from "@xyflow/react";
import type { DecisionNodeData } from "@/lib/types";
import { NodeHandles } from "./NodeHandles";
import { SelfLoopIcon } from "./SelfLoopIcon";

type DecisionNode = Node<DecisionNodeData, "decision">;

export function DecisionNode({ id, data, selected }: NodeProps<DecisionNode>) {
  const edges = useEdges();
  const hasSelfLoop = edges.some((e) => e.source === id && e.target === id);

  return (
    <div
      className={`rounded-lg border-2 bg-surface px-4 py-3 min-w-[160px] ${
        selected ? "border-selected shadow-[0_0_12px_rgba(196,163,90,0.4)]" : "border-node-decision"
      }`}
    >
      <NodeHandles />
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-sm font-bold uppercase tracking-wider text-node-decision">
          {data.label || "DECISION"}
        </div>
        {hasSelfLoop && <SelfLoopIcon color="text-node-decision" />}
      </div>
      {data.description && (
        <div className="mt-1 font-sans text-xs text-stone-500">
          {data.description}
        </div>
      )}
    </div>
  );
}
