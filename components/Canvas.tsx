"use client";

import { useCallback, useMemo, type DragEvent } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  type Connection,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react";
import { nodeTypes } from "./nodes";
import { edgeTypes } from "./edges";
import { createNode } from "@/lib/nodeFactory";
import { getTemplateDefaults } from "./NodeToolbar";
import { autoLayout } from "@/lib/autoLayout";
import type { AppNode, AppEdge, NodeType } from "@/lib/types";

/** Compute absolute positions of all handle anchors on a node */
function buildAnchors(
  prefix: string,
  nx: number, ny: number, nw: number, nh: number,
  stops: number[]
): { id: string; x: number; y: number }[] {
  const anchors: { id: string; x: number; y: number }[] = [];
  for (const pct of stops) {
    const frac = pct / 100;
    anchors.push({ id: `${prefix}-top-${pct}`, x: nx + nw * frac, y: ny });
    anchors.push({ id: `${prefix}-bottom-${pct}`, x: nx + nw * frac, y: ny + nh });
    anchors.push({ id: `${prefix}-left-${pct}`, x: nx, y: ny + nh * frac });
    anchors.push({ id: `${prefix}-right-${pct}`, x: nx + nw, y: ny + nh * frac });
  }
  return anchors;
}

interface CanvasProps {
  nodes: AppNode[];
  edges: AppEdge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange<AppEdge>;
  setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>;
  onGraphChange?: () => void;
}

export function Canvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setNodes,
  setEdges,
  onGraphChange,
}: CanvasProps) {
  const processedEdges = useMemo(() => {
    // Build node lookup for position-based routing
    const nodeMap = new Map<string, AppNode>();
    for (const n of nodes) nodeMap.set(n.id, n);

    const pairSet = new Set<string>();
    for (const e of edges) pairSet.add(`${e.source}|${e.target}`);

    return edges.map((e) => {
      let patched = e;

      // Auto-route: pick closest handle pair based on node positions
      const srcNode = nodeMap.get(e.source);
      const tgtNode = nodeMap.get(e.target);
      if (srcNode && tgtNode && e.source !== e.target) {
        const sw = (srcNode.measured?.width ?? srcNode.width ?? 200);
        const sh = (srcNode.measured?.height ?? srcNode.height ?? 80);
        const tw = (tgtNode.measured?.width ?? tgtNode.width ?? 200);
        const th = (tgtNode.measured?.height ?? tgtNode.height ?? 80);

        // Find the closest source-handle / target-handle pair
        const stops = [20, 40, 60, 80];
        let bestDist = Infinity;
        let bestSrc = "s-right-50";
        let bestTgt = "t-left-50";

        const srcAnchors = buildAnchors("s", srcNode.position.x, srcNode.position.y, sw, sh, stops);
        const tgtAnchors = buildAnchors("t", tgtNode.position.x, tgtNode.position.y, tw, th, stops);

        for (const sa of srcAnchors) {
          for (const ta of tgtAnchors) {
            const ddx = ta.x - sa.x;
            const ddy = ta.y - sa.y;
            const dist = ddx * ddx + ddy * ddy;
            if (dist < bestDist) {
              bestDist = dist;
              bestSrc = sa.id;
              bestTgt = ta.id;
            }
          }
        }
        patched = { ...patched, sourceHandle: bestSrc, targetHandle: bestTgt };
      }

      // Bidirectional offset
      const reverseKey = `${e.target}|${e.source}`;
      if (pairSet.has(reverseKey) && e.source !== e.target) {
        const sign = e.source < e.target ? 1 : -1;
        patched = { ...patched, data: { ...patched.data, _offset: sign * 6 } as AppEdge["data"] };
      }

      return patched;
    });
  }, [edges, nodes]);

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      const edge: AppEdge = {
        ...connection,
        id: `${connection.source}-${connection.target}`,
        type: "always",
        data: { transition_type: "always" },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#A89B8C" },
      };
      setEdges((eds) => addEdge(edge, eds));
      onGraphChange?.();
    },
    [setEdges, onGraphChange]
  );

  const handleNodesChange: OnNodesChange<AppNode> = useCallback(
    (changes) => {
      onNodesChange(changes);
      const hasPositionChange = changes.some(
        (c) => c.type === "position" || c.type === "remove"
      );
      if (hasPositionChange) onGraphChange?.();
    },
    [onNodesChange, onGraphChange]
  );

  const handleEdgesChange: OnEdgesChange<AppEdge> = useCallback(
    (changes) => {
      onEdgesChange(changes);
      const hasRemoval = changes.some((c) => c.type === "remove");
      if (hasRemoval) onGraphChange?.();
    },
    [onEdgesChange, onGraphChange]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handlePrettify = useCallback(() => {
    setNodes((nds) => {
      const laid = autoLayout(nds, edges);
      queueMicrotask(() => onGraphChange?.());
      return laid;
    });
  }, [edges, setNodes, onGraphChange]);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = (event.target as HTMLElement)
        .closest(".react-flow")
        ?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // Handle action drop onto existing prompt node (tools or human_input)
      const action = event.dataTransfer.getData("application/agentarchitect-action");
      if (action) {
        const isHI = action === "__human_input__";
        setNodes((nds) =>
          nds.map((n) => {
            if (n.type !== "prompt") return n;
            const w = n.measured?.width ?? n.width ?? 200;
            const h = n.measured?.height ?? n.height ?? 80;
            const inX = position.x >= n.position.x && position.x <= n.position.x + w;
            const inY = position.y >= n.position.y && position.y <= n.position.y + h;
            if (!inX || !inY) return n;
            if (isHI) {
              return { ...n, data: { ...n.data, human_input: true } };
            }
            const tools = (n.data as { tools: string[] }).tools || [];
            if (tools.includes(action)) return n;
            return { ...n, data: { ...n.data, tools: [...tools, action] } };
          })
        );
        onGraphChange?.();
        return;
      }

      // Handle new node drop
      const type = event.dataTransfer.getData("application/agentarchitect-node") as NodeType;
      if (!type) return;

      const template = event.dataTransfer.getData("application/agentarchitect-template");
      const newNode = createNode(type, position);
      if (template && type === "prompt") {
        const defs = getTemplateDefaults(template);
        newNode.data = { ...newNode.data, label: defs.label, description: defs.description };
      }
      setNodes((nds) => [...nds, newNode]);
      onGraphChange?.();
    },
    [setNodes, onGraphChange]
  );

  return (
    <div className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={processedEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: "always",
          markerEnd: { type: MarkerType.ArrowClosed, color: "#A89B8C" },
        }}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-canvas"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#E2D8CC"
        />
        <Controls />
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handlePrettify}
            className="rounded-lg bg-surface border border-surface-light px-3 py-1.5 font-mono text-xs text-stone-600 hover:text-stone-800 hover:border-selected/40 transition-colors shadow-sm"
          >
            Prettify
          </button>
        </div>
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case "start": return "#7D9B76";
              case "prompt": return "#7B96AA";
              case "decision": return "#C4836A";
              case "humanInput": return "#B08B99";
              case "end": return "#8B5E5E";
              default: return "#A89B8C";
            }
          }}
          maskColor="rgba(250, 246, 241, 0.7)"
        />
      </ReactFlow>
    </div>
  );
}
