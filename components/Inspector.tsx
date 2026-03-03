"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useReactFlow, useOnSelectionChange, MarkerType } from "@xyflow/react";
import type { AppNode, AppEdge, NodeType, EdgeType, TransitionMode } from "@/lib/types";

export function Inspector({ onGraphChange }: { onGraphChange?: () => void }) {
  const { getNode, getEdge, getEdges, getNodes, setNodes, setEdges } = useReactFlow<AppNode, AppEdge>();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  useOnSelectionChange({
    onChange: useCallback(({ nodes, edges }: { nodes: AppNode[]; edges: AppEdge[] }) => {
      setSelectedNodeId(nodes.length === 1 ? nodes[0].id : null);
      setSelectedEdgeId(edges.length === 1 ? edges[0].id : null);
    }, []),
  });

  const selectedNode = selectedNodeId ? getNode(selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? getEdge(selectedEdgeId) : null;

  if (!selectedNode && !selectedEdge) return null;

  return (
    <div className="w-96 bg-surface border-l border-surface-light h-full overflow-y-auto p-4">
      {selectedNode && (
        <NodeInspector
          node={selectedNode}
          setNodes={setNodes}
          setEdges={setEdges}
          getEdges={getEdges}
          getNode={getNode}
          getNodes={getNodes}
          onGraphChange={onGraphChange}
        />
      )}
      {selectedEdge && !selectedNode && (
        <EdgeInspector
          edge={selectedEdge}
          setEdges={setEdges}
          onGraphChange={onGraphChange}
        />
      )}
    </div>
  );
}

function NodeInspector({
  node,
  setNodes,
  setEdges,
  getEdges,
  getNode,
  getNodes,
  onGraphChange,
}: {
  node: AppNode;
  setNodes: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["setNodes"];
  setEdges: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["setEdges"];
  getEdges: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["getEdges"];
  getNode: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["getNode"];
  getNodes: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["getNodes"];
  onGraphChange?: () => void;
}) {
  // ── Snapshot for save / cancel ──────────────────────────────
  const snapshotRef = useRef<{ data: string; edges: string } | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Capture snapshot on node selection; auto-revert unsaved changes on deselection
  useEffect(() => {
    const capturedId = node.id;
    snapshotRef.current = {
      data: JSON.stringify(getNode(capturedId)?.data),
      edges: JSON.stringify(getEdges().filter((e) => e.source === capturedId)),
    };
    setIsDirty(false);

    return () => {
      // Auto-revert to snapshot when leaving this node (no-op if already saved)
      const snap = snapshotRef.current;
      if (!snap) return;
      const snapData = JSON.parse(snap.data);
      const snapEdges = JSON.parse(snap.edges) as AppEdge[];
      setNodes((nds) =>
        nds.map((n) => (n.id === capturedId ? { ...n, data: snapData } : n))
      );
      setEdges((eds) => {
        const other = eds.filter((e) => e.source !== capturedId);
        return [...other, ...snapEdges];
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.id]);

  const markDirty = useCallback(() => setIsDirty(true), []);

  const updateData = useCallback(
    (updates: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, ...updates } }
            : n
        )
      );
      setIsDirty(true);
    },
    [node.id, setNodes]
  );

  const handleSave = useCallback(() => {
    const currentNode = getNode(node.id);
    snapshotRef.current = {
      data: JSON.stringify(currentNode?.data),
      edges: JSON.stringify(getEdges().filter((e) => e.source === node.id)),
    };
    setIsDirty(false);
    onGraphChange?.();
  }, [node.id, getNode, getEdges, onGraphChange]);

  const handleCancel = useCallback(() => {
    const snap = snapshotRef.current;
    if (!snap) return;
    const snapData = JSON.parse(snap.data);
    const snapEdges = JSON.parse(snap.edges) as AppEdge[];
    setNodes((nds) =>
      nds.map((n) => (n.id === node.id ? { ...n, data: snapData } : n))
    );
    setEdges((eds) => {
      const other = eds.filter((e) => e.source !== node.id);
      return [...other, ...snapEdges];
    });
    setIsDirty(false);
  }, [node.id, setNodes, setEdges]);

  // ── Render ──────────────────────────────────────────────────
  const nodeType = node.data.type as NodeType;
  const colorMap: Record<NodeType, string> = {
    start: "text-node-start",
    prompt: "text-node-prompt",
    decision: "text-node-decision",
    humanInput: "text-node-human",
    end: "text-node-end",
  };

  return (
    <div className="space-y-4">
      <div className={`font-mono text-sm font-bold uppercase tracking-wider ${colorMap[nodeType]}`}>
        {nodeType === "prompt" ? "State" : `${nodeType} State`}
      </div>

      <Field
        label="State Name"
        value={node.data.label}
        onChange={(v) => updateData({ label: v })}
      />
      <TextAreaField
        label="Description"
        value={node.data.description}
        onChange={(v) => updateData({ description: v })}
      />

      {nodeType === "prompt" && "tools" in node.data && (
        <>
          <ActionsField
            tools={(node.data as { tools: string[] }).tools}
            humanInput={(node.data as { human_input: boolean }).human_input || false}
            onToolsChange={(v) => updateData({ tools: v })}
            onHumanInputChange={(v) => updateData({ human_input: v })}
            getNodes={getNodes}
          />
          <OutputFormatIndicator
            transitionMode={((node.data as { transition_mode?: TransitionMode }).transition_mode) || "serial"}
          />
        </>
      )}

      {nodeType === "decision" && "conditions" in node.data && (
        <ListField
          label="Conditions"
          value={(node.data as { conditions: string[] }).conditions}
          onChange={(v) => updateData({ conditions: v })}
        />
      )}

      {nodeType === "humanInput" && "input_fields" in node.data && (
        <ListField
          label="Input Fields"
          value={(node.data as { input_fields: string[] }).input_fields}
          onChange={(v) => updateData({ input_fields: v })}
        />
      )}

      {nodeType === "end" && "output_summary" in node.data && (
        <TextAreaField
          label="Output Summary"
          value={(node.data as { output_summary: string }).output_summary}
          onChange={(v) => updateData({ output_summary: v })}
        />
      )}

      {nodeType === "prompt" ? (
        <>
          <StateTable
            nodeId={node.id}
            transitionMode={((node.data as { transition_mode?: TransitionMode }).transition_mode) || "serial"}
            onTransitionModeChange={(mode) => {
              const fmt = mode === "serial"
                ? ["action", "message"]
                : ["action", "message", "nextState"];
              updateData({ transition_mode: mode, output_format: fmt });
            }}
            getEdges={getEdges}
            setEdges={setEdges}
            setNodes={setNodes}
            getNode={getNode}
            getNodes={getNodes}
            onGraphChange={markDirty}
          />
          <IncomingData
            nodeId={node.id}
            getEdges={getEdges}
            getNode={getNode}
          />
        </>
      ) : (
        <OutgoingTransitions nodeId={node.id} getEdges={getEdges} getNode={getNode} />
      )}

      {/* Save / Cancel */}
      <div className="pt-3 mt-3 border-t border-surface-light flex gap-2">
        <button
          onClick={handleCancel}
          disabled={!isDirty}
          className={`flex-1 rounded border px-3 py-2 font-mono text-sm transition-colors ${
            isDirty
              ? "border-stone-400 text-stone-600 hover:bg-surface-light"
              : "border-surface-light text-stone-300 cursor-not-allowed"
          }`}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`flex-1 rounded border px-3 py-2 font-mono text-sm transition-colors ${
            isDirty
              ? "bg-selected/20 border-selected/40 text-selected hover:bg-selected/30"
              : "bg-surface-light border-surface-light text-stone-300 cursor-not-allowed"
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function OutgoingTransitions({
  nodeId,
  getEdges,
  getNode,
}: {
  nodeId: string;
  getEdges: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["getEdges"];
  getNode: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["getNode"];
}) {
  const outgoing = getEdges().filter((e) => e.source === nodeId);
  if (outgoing.length === 0) return null;

  return (
    <div className="pt-3 mt-3 border-t border-surface-light">
      <div className="font-mono text-sm font-bold uppercase tracking-wider text-stone-500 mb-2">
        Outgoing Transitions
      </div>
      <div className="space-y-2">
        {outgoing.map((edge) => {
          const target = getNode(edge.target);
          const targetLabel = target?.data?.label || edge.target;
          const isSelfLoop = edge.source === edge.target;
          const transitionType = edge.data?.transition_type || "always";

          return (
            <div
              key={edge.id}
              className="rounded bg-surface-light px-2.5 py-2 text-sm"
            >
              <div className="flex items-center gap-1.5 text-stone-700">
                <span className="text-stone-400">&rarr;</span>
                <span className="font-medium">{targetLabel}</span>
                <span className="text-stone-400">
                  ({isSelfLoop ? "self-loop" : transitionType})
                </span>
              </div>
              {edge.data?.condition && (
                <div className="mt-1 text-stone-500 pl-4">
                  <span className="text-stone-400">when:</span> {edge.data.condition}
                </div>
              )}
              {edge.data?.passes && (
                <div className="mt-0.5 text-stone-500 pl-4">
                  <span className="text-stone-400">passes:</span> {edge.data.passes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StateTable({
  nodeId,
  transitionMode,
  onTransitionModeChange,
  getEdges,
  setEdges,
  setNodes,
  getNode,
  getNodes,
  onGraphChange,
}: {
  nodeId: string;
  transitionMode: TransitionMode;
  onTransitionModeChange: (v: TransitionMode) => void;
  getEdges: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["getEdges"];
  setEdges: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["setEdges"];
  setNodes: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["setNodes"];
  getNode: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["getNode"];
  getNodes: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["getNodes"];
  onGraphChange?: () => void;
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  const outgoing = getEdges().filter((e) => e.source === nodeId);
  const allNodes = getNodes();

  /** Sync next_states on the node data whenever transitions change */
  const syncNextStates = useCallback(
    (edgesAfter: AppEdge[]) => {
      const targets = edgesAfter
        .filter((e) => e.source === nodeId)
        .map((e) => {
          if (e.target === nodeId) return "__self__";
          const t = getNode(e.target);
          return t?.data?.label || e.target;
        });
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, next_states: targets } }
            : n
        )
      );
    },
    [nodeId, getNode, setNodes]
  );

  const addTransition = (targetId: string) => {
    const edgeId = `${nodeId}-${targetId}`;
    if (getEdges().find((e) => e.id === edgeId)) return;
    const newEdge: AppEdge = {
      id: edgeId,
      source: nodeId,
      target: targetId,
      sourceHandle: "s-right-50",
      targetHandle: "t-left-50",
      type: "always",
      data: { transition_type: "always", condition: "", passes: "" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#A89B8C" },
    };
    setEdges((eds) => {
      const next = [...eds, newEdge];
      syncNextStates(next);
      return next;
    });
    onGraphChange?.();
    setShowDropdown(false);
  };

  const updateTransition = (edgeId: string, field: string, value: string) => {
    setEdges((eds) =>
      eds.map((e) =>
        e.id === edgeId
          ? { ...e, data: { ...e.data, [field]: value } as AppEdge["data"] }
          : e
      )
    );
    onGraphChange?.();
  };

  const toggleTransitionType = (edgeId: string, newType: EdgeType) => {
    setEdges((eds) =>
      eds.map((e) => {
        if (e.id !== edgeId) return e;
        return {
          ...e,
          type: newType,
          data: {
            ...e.data,
            transition_type: newType,
            condition: newType === "always" ? "" : (e.data?.condition || ""),
          } as AppEdge["data"],
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: newType === "conditional" ? "#C4836A" : "#A89B8C",
          },
        };
      })
    );
    onGraphChange?.();
  };

  const deleteTransition = (edgeId: string) => {
    setEdges((eds) => {
      const next = eds.filter((e) => e.id !== edgeId);
      syncNextStates(next);
      return next;
    });
    onGraphChange?.();
  };

  /** Router mode: set type + condition on ALL outgoing edges at once */
  const setAllTransitionTypes = (newType: EdgeType) => {
    setEdges((eds) =>
      eds.map((e) => {
        if (e.source !== nodeId) return e;
        return {
          ...e,
          type: newType,
          data: {
            ...e.data,
            transition_type: newType,
            condition: newType === "always" ? "" : (e.data?.condition || ""),
          } as AppEdge["data"],
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: newType === "conditional" ? "#C4836A" : "#A89B8C",
          },
        };
      })
    );
    onGraphChange?.();
  };

  const setAllConditions = (condition: string) => {
    setEdges((eds) =>
      eds.map((e) => {
        if (e.source !== nodeId) return e;
        return {
          ...e,
          data: { ...e.data, condition } as AppEdge["data"],
        };
      })
    );
    onGraphChange?.();
  };

  // Mode constraints
  const isSerial = transitionMode === "serial";
  const isRouter = transitionMode === "router";
  const existingTargets = new Set(outgoing.map((e) => e.target));
  const hasSelfLoop = existingTargets.has(nodeId);

  // Serial: max 1 transition, no self
  // Router/Parallel: unlimited, self allowed
  const canAddMore = isSerial ? outgoing.length < 1 : true;

  const availableNodes = allNodes.filter((n) => {
    // Serial: never show self
    if (n.id === nodeId) return !isSerial && !hasSelfLoop;
    // Don't show already-connected targets (except for parallel which allows duplicates via different edges)
    return !existingTargets.has(n.id);
  });

  const modes: TransitionMode[] = ["serial", "router", "parallel"];

  return (
    <div className="pt-3 mt-3 border-t border-surface-light">
      <div className="font-mono text-sm font-bold uppercase tracking-wider text-stone-500 mb-2">
        Next State
      </div>

      {/* Transition mode selector */}
      <div className="mb-3">
        <label className="block text-sm text-stone-500 mb-1">Mode</label>
        <div className="flex gap-1">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => onTransitionModeChange(m)}
              className={`flex-1 rounded px-2 py-1 font-mono text-xs uppercase transition-colors ${
                transitionMode === m
                  ? "bg-selected/20 text-selected border border-selected/40"
                  : "bg-surface-light text-stone-400 border border-surface-light hover:text-stone-600"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="mt-1 text-xs text-stone-400">
          {isSerial && "Single next state, no self-loop."}
          {transitionMode === "router" && "Routes to one of multiple states."}
          {transitionMode === "parallel" && "Fans out to all states in parallel."}
        </div>
      </div>

      {/* Router mode: unified type toggle for all transitions */}
      {isRouter && outgoing.length > 0 && (() => {
        const sharedType = outgoing[0]?.data?.transition_type || "always";
        const sharedCondition = outgoing[0]?.data?.condition || "";
        return (
          <div className="mb-3 rounded bg-surface-light px-2.5 py-2 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-stone-400 text-sm w-12 shrink-0">type:</span>
              <div className="flex gap-1">
                {(["always", "conditional"] as EdgeType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setAllTransitionTypes(t)}
                    className={`rounded px-2 py-0.5 font-mono text-xs uppercase ${
                      sharedType === t
                        ? "bg-selected/20 text-selected border border-selected/40"
                        : "bg-surface text-stone-400 border border-surface-light hover:text-stone-600"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {sharedType === "conditional" && (
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400 text-sm w-12 shrink-0">when:</span>
                <input
                  type="text"
                  value={sharedCondition}
                  onChange={(e) => setAllConditions(e.target.value)}
                  placeholder="condition for routing..."
                  className="flex-1 rounded bg-surface border border-surface-light px-2 py-0.5 text-xs text-stone-700 focus:border-selected focus:outline-none"
                />
              </div>
            )}
          </div>
        );
      })()}

      {/* Existing transitions */}
      <div className="space-y-0">
        {outgoing.map((edge) => {
          const target = getNode(edge.target);
          const targetLabel = target?.data?.label || edge.target;
          const isSelfLoop = edge.source === edge.target;
          const transitionType = edge.data?.transition_type || "always";

          return (
            <div
              key={edge.id}
              className="rounded bg-surface-light px-2.5 py-2 text-sm mb-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <span className="text-stone-400 font-mono">
                    {isSelfLoop ? "↻" : "→"}
                  </span>
                  <span className="font-medium">
                    {isSelfLoop ? "Self (loop)" : targetLabel}
                  </span>
                </div>
                <button
                  onClick={() => deleteTransition(edge.id)}
                  className="text-stone-400 hover:text-red-400 text-xs px-1"
                  title="Remove transition"
                >
                  ×
                </button>
              </div>
              <div className="mt-1.5 pl-4 space-y-1">
                {/* Per-transition type toggle — only for serial & parallel (router uses unified toggle above) */}
                {!isRouter && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-400 w-12 shrink-0">type:</span>
                    <div className="flex gap-1">
                      {(["always", "conditional"] as EdgeType[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => toggleTransitionType(edge.id, t)}
                          className={`rounded px-2 py-0.5 font-mono text-xs uppercase ${
                            transitionType === t
                              ? "bg-selected/20 text-selected border border-selected/40"
                              : "bg-surface text-stone-400 border border-surface-light hover:text-stone-600"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {!isRouter && transitionType === "conditional" && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-400 w-12 shrink-0">when:</span>
                    <input
                      type="text"
                      value={edge.data?.condition || ""}
                      onChange={(e) =>
                        updateTransition(edge.id, "condition", e.target.value)
                      }
                      placeholder="condition..."
                      className="flex-1 rounded bg-surface border border-surface-light px-2 py-0.5 text-xs text-stone-700 focus:border-selected focus:outline-none"
                    />
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-400 w-12 shrink-0">passes:</span>
                  <input
                    type="text"
                    value={edge.data?.passes || ""}
                    onChange={(e) =>
                      updateTransition(edge.id, "passes", e.target.value)
                    }
                    placeholder="data to pass..."
                    className="flex-1 rounded bg-surface border border-surface-light px-2 py-0.5 text-xs text-stone-700 focus:border-selected focus:outline-none"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add transition dropdown — hidden when serial and already has 1 */}
      {canAddMore && (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full rounded border border-dashed border-stone-600 px-2 py-1.5 text-sm text-stone-400 hover:border-selected hover:text-selected transition-colors"
          >
            + Add next state
          </button>
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1 rounded bg-surface border border-surface-light shadow-lg z-10 max-h-48 overflow-y-auto">
              {availableNodes.length === 0 ? (
                <div className="px-3 py-2 text-sm text-stone-500">
                  No available targets
                </div>
              ) : (
                availableNodes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => addTransition(n.id)}
                    className="w-full text-left px-3 py-2 text-sm text-stone-600 hover:bg-surface-light hover:text-stone-800 transition-colors"
                  >
                    {n.id === nodeId ? "↻ Self (loop)" : `→ ${n.data.label}`}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function IncomingData({
  nodeId,
  getEdges,
  getNode,
}: {
  nodeId: string;
  getEdges: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["getEdges"];
  getNode: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["getNode"];
}) {
  const incoming = getEdges().filter(
    (e) => e.target === nodeId && e.source !== nodeId
  );
  if (incoming.length === 0) return null;

  return (
    <div className="pt-3 mt-3 border-t border-surface-light">
      <div className="font-mono text-sm font-bold uppercase tracking-wider text-stone-500 mb-2">
        Incoming
      </div>
      <div className="space-y-1">
        {incoming.map((edge) => {
          const source = getNode(edge.source);
          const sourceLabel = source?.data?.label || edge.source;
          const passes = edge.data?.passes;

          return (
            <div
              key={edge.id}
              className="rounded bg-surface-light px-2.5 py-1.5 text-xs text-stone-600"
            >
              <span className="text-stone-400">←</span>{" "}
              <span className="font-medium text-stone-700">{sourceLabel}</span>
              {passes && (
                <span className="text-stone-400">: {passes}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EdgeInspector({
  edge,
  setEdges,
  onGraphChange,
}: {
  edge: AppEdge;
  setEdges: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["setEdges"];
  onGraphChange?: () => void;
}) {
  // ── Snapshot for save / cancel ──────────────────────────────
  const snapshotRef = useRef<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const capturedId = edge.id;
    snapshotRef.current = JSON.stringify({ type: edge.type, data: edge.data });
    setIsDirty(false);

    return () => {
      const snap = snapshotRef.current;
      if (!snap) return;
      const parsed = JSON.parse(snap) as { type: string; data: AppEdge["data"] };
      setEdges((eds) =>
        eds.map((e) =>
          e.id === capturedId
            ? { ...e, type: parsed.type, data: parsed.data }
            : e
        )
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edge.id]);

  const transitionType = edge.data?.transition_type || "always";

  const updateEdge = useCallback(
    (updates: { type?: string; data?: Partial<AppEdge["data"]> }) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edge.id
            ? {
                ...e,
                ...(updates.type ? { type: updates.type } : {}),
                data: { ...e.data, ...updates.data } as AppEdge["data"],
              }
            : e
        )
      );
      setIsDirty(true);
    },
    [edge.id, setEdges]
  );

  const handleSave = useCallback(() => {
    snapshotRef.current = JSON.stringify({ type: edge.type, data: edge.data });
    setIsDirty(false);
    onGraphChange?.();
  }, [edge.type, edge.data, onGraphChange]);

  const handleCancel = useCallback(() => {
    const snap = snapshotRef.current;
    if (!snap) return;
    const parsed = JSON.parse(snap) as { type: string; data: AppEdge["data"] };
    setEdges((eds) =>
      eds.map((e) =>
        e.id === edge.id
          ? { ...e, type: parsed.type, data: parsed.data }
          : e
      )
    );
    setIsDirty(false);
  }, [edge.id, setEdges]);

  return (
    <div className="space-y-4">
      <div className="font-mono text-sm font-bold uppercase tracking-wider text-stone-500">
        Transition
      </div>

      <div>
        <label className="block text-sm text-stone-500 mb-1">Type</label>
        <div className="flex gap-2">
          {(["always", "conditional"] as EdgeType[]).map((t) => (
            <button
              key={t}
              onClick={() =>
                updateEdge({
                  type: t,
                  data: { transition_type: t, condition: edge.data?.condition },
                })
              }
              className={`flex-1 rounded px-3 py-1.5 font-mono text-xs uppercase ${
                transitionType === t
                  ? "bg-selected/20 text-selected border border-selected/40"
                  : "bg-surface-light text-stone-500 border border-transparent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {transitionType === "conditional" && (
        <Field
          label="Condition"
          value={edge.data?.condition || ""}
          onChange={(v) =>
            updateEdge({ data: { transition_type: "conditional", condition: v } })
          }
          placeholder='e.g. output.intent == "search"'
        />
      )}

      <Field
        label="Data Passed"
        value={edge.data?.passes || ""}
        onChange={(v) =>
          updateEdge({ data: { ...edge.data, passes: v } })
        }
        placeholder="e.g. intent, files[], errors[]"
      />

      {/* Save / Cancel */}
      <div className="pt-3 mt-3 border-t border-surface-light flex gap-2">
        <button
          onClick={handleCancel}
          disabled={!isDirty}
          className={`flex-1 rounded border px-3 py-2 font-mono text-sm transition-colors ${
            isDirty
              ? "border-stone-400 text-stone-600 hover:bg-surface-light"
              : "border-surface-light text-stone-300 cursor-not-allowed"
          }`}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`flex-1 rounded border px-3 py-2 font-mono text-sm transition-colors ${
            isDirty
              ? "bg-selected/20 border-selected/40 text-selected hover:bg-selected/30"
              : "bg-surface-light border-surface-light text-stone-300 cursor-not-allowed"
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
}

// ─── Shared form fields ───────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-stone-500 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded bg-surface-light border border-surface-light px-3 py-2 text-sm text-stone-800 focus:border-selected focus:outline-none"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm text-stone-500 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded bg-surface-light border border-surface-light px-3 py-2 text-sm text-stone-800 focus:border-selected focus:outline-none resize-none"
      />
    </div>
  );
}

function OutputFormatIndicator({ transitionMode }: { transitionMode: TransitionMode }) {
  const outputs = transitionMode === "serial"
    ? ["action", "message"]
    : ["action", "message", "nextState"];

  return (
    <div>
      <label className="block text-sm text-stone-500 mb-1">Expected Output</label>
      <div className="flex flex-wrap gap-1">
        {outputs.map((o) => (
          <span
            key={o}
            className="rounded bg-selected/20 border border-selected/40 px-2 py-1 font-mono text-xs uppercase text-selected"
          >
            {o}
          </span>
        ))}
      </div>
      <div className="mt-1 text-xs text-stone-400">
        Auto-derived from {transitionMode} mode.
      </div>
    </div>
  );
}

// ─── Preset action names (shared with NodeToolbar) ───────────

const PRESET_ACTIONS = [
  "bash", "shell", "grep", "awk", "sed", "curl",
  "file_read", "code_search", "web_search", "db_query",
  "file_write", "code_interpreter", "api_call",
  "memory_read", "memory_write",
];

function ActionsField({
  tools,
  humanInput,
  onToolsChange,
  onHumanInputChange,
  getNodes,
}: {
  tools: string[];
  humanInput: boolean;
  onToolsChange: (v: string[]) => void;
  onHumanInputChange: (v: boolean) => void;
  getNodes: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["getNodes"];
}) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Collect all known actions: presets + all tools used across the architecture
  const allKnown = (() => {
    const set = new Set(PRESET_ACTIONS);
    for (const n of getNodes()) {
      if (n.data.type === "prompt") {
        const t = (n.data as { tools: string[] }).tools || [];
        for (const name of t) set.add(name);
      }
    }
    return Array.from(set);
  })();

  const query = input.trim().toLowerCase();
  const suggestions = query
    ? allKnown.filter(
        (a) => a.toLowerCase().includes(query) && !tools.includes(a)
      )
    : [];
  const exactExists = allKnown.some((a) => a.toLowerCase() === query) || tools.includes(input.trim());
  const showAdd = query && !exactExists;

  const addTool = (name: string) => {
    if (!tools.includes(name)) onToolsChange([...tools, name]);
    setInput("");
    setShowSuggestions(false);
  };

  return (
    <div>
      <label className="block text-sm text-stone-500 mb-1">Actions</label>
      {/* Current actions: HI first, then tools */}
      <div className="flex flex-wrap gap-1 mb-1.5">
        {/* Human Input chip — always first */}
        <button
          onClick={() => onHumanInputChange(!humanInput)}
          className={`flex items-center gap-1 rounded px-2 py-1 font-mono text-xs transition-colors ${
            humanInput
              ? "bg-node-human/20 text-node-human"
              : "bg-surface-light text-stone-400 border border-dashed border-stone-300"
          }`}
        >
          HI
          {humanInput && (
            <span className="text-node-human/50 hover:text-node-human">×</span>
          )}
        </button>
        {/* Tool chips */}
        {tools.map((tool) => (
          <span
            key={tool}
            className="flex items-center gap-1 rounded bg-node-prompt/20 px-2 py-1 font-mono text-xs text-node-prompt"
          >
            {tool}
            <button
              onClick={() => onToolsChange(tools.filter((t) => t !== tool))}
              className="text-node-prompt/60 hover:text-node-prompt"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      {/* Search input with autocomplete */}
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              e.preventDefault();
              addTool(input.trim());
            }
          }}
          placeholder="Search or add action..."
          className="w-full rounded bg-surface-light border border-surface-light px-3 py-1.5 text-sm text-stone-800 focus:border-selected focus:outline-none"
        />
        {showSuggestions && (suggestions.length > 0 || showAdd) && (
          <div className="absolute left-0 right-0 top-full mt-1 rounded bg-surface border border-surface-light shadow-lg z-10 max-h-40 overflow-y-auto">
            {suggestions.map((s) => (
              <button
                key={s}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addTool(s)}
                className="w-full text-left px-3 py-2 text-sm text-stone-600 hover:bg-surface-light hover:text-stone-800 font-mono"
              >
                {s}
              </button>
            ))}
            {showAdd && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addTool(input.trim())}
                className="w-full text-left px-3 py-2 text-sm text-selected hover:bg-selected/10 font-mono"
              >
                + Add &quot;{input.trim()}&quot;
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TagsField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");

  return (
    <div>
      <label className="block text-sm text-stone-500 mb-1">{label}</label>
      <div className="flex flex-wrap gap-1 mb-1">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded bg-node-prompt/20 px-2 py-1 font-mono text-xs text-node-prompt"
          >
            {tag}
            <button
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="text-node-prompt/60 hover:text-node-prompt"
            >
              x
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && input.trim()) {
            e.preventDefault();
            if (!value.includes(input.trim())) {
              onChange([...value, input.trim()]);
            }
            setInput("");
          }
        }}
        placeholder="Type and press Enter"
        className="w-full rounded bg-surface-light border border-surface-light px-3 py-1.5 text-sm text-stone-800 focus:border-selected focus:outline-none"
      />
    </div>
  );
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-stone-500">{label}</label>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
          value ? "bg-selected" : "bg-stone-300"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
            value ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function MultiSelectField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div>
      <label className="block text-sm text-stone-500 mb-1">{label}</label>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => {
          const isSelected = value.includes(option);
          return (
            <button
              key={option}
              onClick={() => toggle(option)}
              className={`rounded px-2 py-1 font-mono text-xs uppercase transition-colors ${
                isSelected
                  ? "bg-selected/20 text-selected border border-selected/40"
                  : "bg-surface-light text-stone-400 border border-surface-light hover:text-stone-600"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NodeLabelMultiSelect({
  label,
  currentNodeId,
  value,
  onChange,
  getNodes,
}: {
  label: string;
  currentNodeId: string;
  value: string[];
  onChange: (v: string[]) => void;
  getNodes: ReturnType<typeof useReactFlow<AppNode, AppEdge>>["getNodes"];
}) {
  const allNodes = getNodes();
  const otherLabels = allNodes
    .filter((n) => n.id !== currentNodeId)
    .map((n) => n.data.label)
    .filter(Boolean);

  const toggle = (nodeLabel: string) => {
    if (value.includes(nodeLabel)) {
      onChange(value.filter((v) => v !== nodeLabel));
    } else {
      onChange([...value, nodeLabel]);
    }
  };

  if (otherLabels.length === 0) return null;

  return (
    <div>
      <label className="block text-sm text-stone-500 mb-1">{label}</label>
      <div className="flex flex-wrap gap-1">
        {otherLabels.map((nodeLabel) => {
          const isSelected = value.includes(nodeLabel);
          return (
            <button
              key={nodeLabel}
              onClick={() => toggle(nodeLabel)}
              className={`rounded px-2 py-1 font-mono text-xs uppercase transition-colors ${
                isSelected
                  ? "bg-node-prompt/20 text-node-prompt border border-node-prompt/40"
                  : "bg-surface-light text-stone-400 border border-surface-light hover:text-stone-600"
              }`}
            >
              {nodeLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ListField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");

  return (
    <div>
      <label className="block text-sm text-stone-500 mb-1">{label}</label>
      <ul className="space-y-1 mb-1">
        {value.map((item, i) => (
          <li
            key={i}
            className="flex items-center justify-between rounded bg-surface-light px-2 py-1 text-xs text-stone-600"
          >
            <span>{item}</span>
            <button
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="text-stone-400 hover:text-red-400"
            >
              x
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              e.preventDefault();
              onChange([...value, input.trim()]);
              setInput("");
            }
          }}
          placeholder="Type and press Enter"
          className="flex-1 rounded bg-surface-light border border-surface-light px-3 py-1.5 text-sm text-stone-800 focus:border-selected focus:outline-none"
        />
        <button
          onClick={() => {
            if (input.trim()) {
              onChange([...value, input.trim()]);
              setInput("");
            }
          }}
          className="rounded bg-surface-light px-2 py-1.5 text-xs text-selected hover:bg-selected/10"
        >
          +
        </button>
      </div>
    </div>
  );
}
