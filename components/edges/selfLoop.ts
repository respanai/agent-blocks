// Self-loop: arc from the right side of the node and back.
// sourceX/sourceY here are the center of the handle (bottom & top overlap for self-loops).
// We draw a cubic bezier that goes right, down, and curves back up.

export const SELF_LOOP_LABEL_OFFSET = 70;

export function getSelfLoopPath(cx: number, cy: number): string {
  const r = 50; // how far right the loop extends
  const h = 36; // half-height of the loop
  return [
    `M ${cx} ${cy}`,
    `C ${cx + r} ${cy + h},`,
    `  ${cx + r} ${cy - h},`,
    `  ${cx} ${cy}`,
  ].join(" ");
}
