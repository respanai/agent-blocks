"use client";

import { Handle, Position } from "@xyflow/react";

/**
 * Positions along each side (as %).
 * 4 handles per side × 4 sides = 16 source + 16 target handles.
 * Edges auto-route to the nearest one.
 */
const stops = [20, 40, 60, 80];

interface HandleDef {
  id: string;
  position: Position;
  style: React.CSSProperties;
}

function buildHandles(prefix: string): HandleDef[] {
  const defs: HandleDef[] = [];

  for (const pct of stops) {
    // Top
    defs.push({
      id: `${prefix}-top-${pct}`,
      position: Position.Top,
      style: { left: `${pct}%`, top: 0, transform: "translate(-50%, -50%)" },
    });
    // Bottom
    defs.push({
      id: `${prefix}-bottom-${pct}`,
      position: Position.Bottom,
      style: { left: `${pct}%`, bottom: 0, top: "auto", transform: "translate(-50%, 50%)" },
    });
    // Left
    defs.push({
      id: `${prefix}-left-${pct}`,
      position: Position.Left,
      style: { top: `${pct}%`, left: 0, transform: "translate(-50%, -50%)" },
    });
    // Right
    defs.push({
      id: `${prefix}-right-${pct}`,
      position: Position.Right,
      style: { top: `${pct}%`, right: 0, left: "auto", transform: "translate(50%, -50%)" },
    });
  }
  return defs;
}

const sourceHandles = buildHandles("s");
const targetHandles = buildHandles("t");

const invisibleBase: React.CSSProperties = {
  width: 8,
  height: 8,
  opacity: 0,
  border: "none",
  background: "transparent",
};

export function NodeHandles({
  source = true,
  target = true,
}: {
  source?: boolean;
  target?: boolean;
}) {
  return (
    <>
      {target &&
        targetHandles.map((h) => (
          <Handle
            key={h.id}
            id={h.id}
            type="target"
            position={h.position}
            style={{ ...invisibleBase, ...h.style }}
          />
        ))}
      {source &&
        sourceHandles.map((h) => (
          <Handle
            key={h.id}
            id={h.id}
            type="source"
            position={h.position}
            style={{ ...invisibleBase, ...h.style }}
          />
        ))}
    </>
  );
}
