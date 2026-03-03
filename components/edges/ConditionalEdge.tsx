"use client";

import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import type { AppEdge } from "@/lib/types";

export function ConditionalEdge({
  id,
  source,
  target,
  sourceX: rawSourceX,
  sourceY: rawSourceY,
  targetX: rawTargetX,
  targetY: rawTargetY,
  sourcePosition,
  targetPosition,
  selected,
  markerEnd,
  data,
}: EdgeProps<AppEdge>) {
  if (source === target) return null;

  let sourceX = rawSourceX;
  let sourceY = rawSourceY;
  let targetX = rawTargetX;
  let targetY = rawTargetY;

  const offset = (data as Record<string, unknown>)?._offset as number || 0;
  if (offset !== 0) {
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    sourceX += nx * offset;
    sourceY += ny * offset;
    targetX += nx * offset;
    targetY += ny * offset;
  }

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        stroke: selected ? "#C4A35A" : "#C4836A",
        strokeWidth: 2,
        strokeDasharray: "6 3",
      }}
    />
  );
}
