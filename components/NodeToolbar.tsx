"use client";

import { type DragEvent, useState, useMemo } from "react";
import { useReactFlow } from "@xyflow/react";
import type { AppNode, AppEdge } from "@/lib/types";

// ─── Prompt State Templates ──────────────────────────────────

interface PromptTemplate {
  key: string;
  label: string;
  description: string;
}

const promptTemplates: PromptTemplate[] = [
  {
    key: "orchestrator",
    label: "Orchestrator",
    description: "Routes intent to the right state based on user input and context.",
  },
  {
    key: "synthesizer",
    label: "Synthesizer",
    description: "Combines outputs from multiple states into a coherent response.",
  },
  {
    key: "evaluator",
    label: "Evaluator",
    description: "Inspects results, checks success criteria, decides next step.",
  },
  {
    key: "router",
    label: "Router",
    description: "Classifies input and branches to the appropriate state.",
  },
  {
    key: "custom",
    label: "Custom Prompt",
    description: "",
  },
];

/** Look up default label + description for a template key */
export function getTemplateDefaults(key: string): { label: string; description: string } {
  const t = promptTemplates.find((p) => p.key === key);
  if (!t || t.key === "custom") return { label: "STATE", description: "" };
  return { label: t.label, description: t.description };
}

// ─── Grouped Preset Actions ─────────────────────────────────

const HUMAN_INPUT_KEY = "__human_input__";

interface ActionGroup {
  name: string;
  actions: string[];
}

const actionGroups: ActionGroup[] = [
  { name: "Terminal", actions: ["bash", "shell", "grep", "awk", "sed", "curl"] },
  { name: "Read / Search", actions: ["file_read", "code_search", "web_search", "db_query"] },
  { name: "Write / Execute", actions: ["file_write", "code_interpreter", "api_call"] },
  { name: "Memory", actions: ["memory_read", "memory_write"] },
];

const allPresetActions = actionGroups.flatMap((g) => g.actions);

// ─── Component ───────────────────────────────────────────────

export function NodeToolbar() {
  const { getNodes } = useReactFlow<AppNode, AppEdge>();
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleGroup = (name: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const onTemplateDragStart = (event: DragEvent, template: string) => {
    event.dataTransfer.setData("application/agentarchitect-node", "prompt");
    event.dataTransfer.setData("application/agentarchitect-template", template);
    event.dataTransfer.effectAllowed = "move";
  };

  const onActionDragStart = (event: DragEvent, action: string) => {
    event.dataTransfer.setData("application/agentarchitect-action", action);
    event.dataTransfer.effectAllowed = "copy";
  };

  // Collect user-created tools from all prompt nodes in current architecture
  const userActions = useMemo(() => {
    const all = new Set<string>();
    for (const n of getNodes()) {
      if (n.data.type === "prompt") {
        const tools = (n.data as { tools: string[] }).tools || [];
        for (const t of tools) {
          if (!allPresetActions.includes(t)) all.add(t);
        }
      }
    }
    return Array.from(all).sort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getNodes()]);

  const query = search.trim().toLowerCase();

  const showHI = !query || "human input".includes(query);

  // Filter groups — show a group if it has matching actions
  const filteredGroups = actionGroups.map((g) => ({
    ...g,
    actions: query ? g.actions.filter((a) => a.toLowerCase().includes(query)) : g.actions,
  }));

  const filteredUser = query
    ? userActions.filter((a) => a.toLowerCase().includes(query))
    : userActions;

  const exactExists =
    allPresetActions.includes(query) ||
    userActions.some((a) => a.toLowerCase() === query);

  return (
    <div className="w-72 bg-surface border-r border-surface-light h-full p-4 flex flex-col gap-2 overflow-y-auto">
      {/* Prompt States */}
      <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-stone-500 mb-2">
        Prompt States
      </h2>
      {promptTemplates.map((t) => (
        <div
          key={t.key}
          draggable
          onDragStart={(e) => onTemplateDragStart(e, t.key)}
          className="cursor-grab rounded-lg border-2 bg-surface-light px-4 py-2.5 border-node-prompt text-node-prompt font-mono text-sm font-bold uppercase tracking-wider hover:bg-surface-light/80 active:cursor-grabbing transition-colors"
        >
          {t.label}
        </div>
      ))}

      {/* Actions */}
      <div className="mt-4 border-t border-surface-light pt-4">
        <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-stone-500 mb-2">
          Actions
        </h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search actions..."
          className="w-full rounded bg-surface-light border border-surface-light px-3 py-2 text-sm text-stone-700 focus:border-selected focus:outline-none mb-2"
        />

        <div className="flex flex-col gap-1">
          {/* Human Input — always pinned at top */}
          {showHI && (
            <div
              draggable
              onDragStart={(e) => onActionDragStart(e, HUMAN_INPUT_KEY)}
              className="cursor-grab rounded border-l-2 border-node-human bg-surface-light px-2.5 py-1.5 font-mono text-sm font-medium text-stone-700 hover:bg-surface-light/70 active:cursor-grabbing transition-colors"
            >
              Human Input
            </div>
          )}

          {/* Grouped preset actions */}
          {filteredGroups.map((group) => {
            if (group.actions.length === 0) return null;
            // Auto-expand groups when searching
            const isCollapsed = query ? false : collapsed.has(group.name);

            return (
              <div key={group.name} className="mt-1">
                <button
                  onClick={() => toggleGroup(group.name)}
                  className="flex items-center gap-1 w-full font-mono text-xs uppercase tracking-wider text-stone-400 hover:text-stone-600 transition-colors py-0.5"
                >
                  <span className="text-[10px]">{isCollapsed ? "▸" : "▾"}</span>
                  {group.name}
                </button>
                {!isCollapsed && (
                  <div className="flex flex-col gap-1 mt-1 ml-2">
                    {group.actions.map((action) => (
                      <div
                        key={action}
                        draggable
                        onDragStart={(e) => onActionDragStart(e, action)}
                        className="cursor-grab rounded border-l-2 border-node-prompt bg-surface-light px-2.5 py-1.5 font-mono text-sm font-medium text-stone-700 hover:bg-surface-light/70 active:cursor-grabbing transition-colors"
                      >
                        {action}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* User-created tools */}
          {filteredUser.length > 0 && (
            <>
              <div className="font-mono text-xs uppercase tracking-wider text-stone-400 mt-2 mb-0.5">
                Custom
              </div>
              {filteredUser.map((action) => (
                <div
                  key={action}
                  draggable
                  onDragStart={(e) => onActionDragStart(e, action)}
                  className="cursor-grab rounded border-l-2 border-selected bg-surface-light px-2.5 py-1.5 font-mono text-sm font-medium text-stone-700 hover:bg-surface-light/70 active:cursor-grabbing transition-colors"
                >
                  {action}
                </div>
              ))}
            </>
          )}

          {/* Add new — when search has no exact match */}
          {query && !exactExists && (
            <div
              draggable
              onDragStart={(e) => {
                onActionDragStart(e, search.trim());
                setSearch("");
              }}
              className="cursor-grab rounded border border-dashed border-stone-400 px-2.5 py-1.5 font-mono text-sm font-medium text-stone-500 hover:border-selected hover:text-selected active:cursor-grabbing transition-colors"
            >
              + Add &quot;{search.trim()}&quot;
            </div>
          )}
        </div>

        <div className="mt-2 text-xs text-stone-400 font-sans">
          Drag an action onto a prompt state.
        </div>
      </div>
    </div>
  );
}
