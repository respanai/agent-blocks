"use client";

import { type NodeProps, type Node, useEdges } from "@xyflow/react";
import type { PromptNodeData } from "@/lib/types";
import { NodeHandles } from "./NodeHandles";
import { SelfLoopIcon } from "./SelfLoopIcon";

type PromptNode = Node<PromptNodeData, "prompt">;

export function PromptNode({ id, data, selected }: NodeProps<PromptNode>) {
  const edges = useEdges();
  const hasSelfLoop = edges.some((e) => e.source === id && e.target === id);
  const tools = data.tools || [];
  const humanInput = data.human_input || false;
  const hasAction = tools.length > 0 || humanInput;

  return (
    <div
      className={`rounded-lg border-2 bg-surface px-4 py-3 min-w-[180px] max-w-[260px] ${
        selected ? "border-selected shadow-[0_0_12px_rgba(196,163,90,0.4)]" : "border-node-prompt"
      }`}
    >
      <NodeHandles />
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-sm font-bold uppercase tracking-wider text-node-prompt">
          {data.label || "STATE"}
        </div>
        {hasSelfLoop && <SelfLoopIcon color="text-node-prompt" />}
      </div>
      {data.description && (
        <div className="mt-1 font-sans text-xs text-stone-500">
          {data.description}
        </div>
      )}
      {hasAction && (
        <div className="mt-2 border-t border-surface-light pt-2">
          <div className="font-mono text-xs uppercase tracking-wider text-stone-400 mb-1">
            Action
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {humanInput && (
              <span className="rounded bg-node-human/20 px-1.5 py-0.5 font-mono text-[11px] text-node-human">
                HI
              </span>
            )}
            {tools.map((tool) => (
              <span
                key={tool}
                className="rounded bg-node-prompt/20 px-1.5 py-0.5 font-mono text-[11px] text-node-prompt"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
