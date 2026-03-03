import yaml from "js-yaml";
import dagre from "@dagrejs/dagre";
import type {
  ExportedArchitecture,
  AppNode,
  AppEdge,
  NodeType,
} from "./types";
import { MarkerType } from "@xyflow/react";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

export function parseYaml(yamlString: string): ExportedArchitecture {
  const parsed = yaml.load(yamlString) as ExportedArchitecture;

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid YAML: not an object");
  }
  if (!parsed.states || !Array.isArray(parsed.states)) {
    throw new Error("Invalid YAML: missing 'states' array");
  }
  if (!parsed.transitions || !Array.isArray(parsed.transitions)) {
    throw new Error("Invalid YAML: missing 'transitions' array");
  }

  const validTypes: NodeType[] = ["start", "prompt", "decision", "humanInput", "end"];
  for (const state of parsed.states) {
    if (!state.id || !state.type || !state.label) {
      throw new Error(`Invalid state: missing id, type, or label in ${JSON.stringify(state)}`);
    }
    if (!validTypes.includes(state.type)) {
      throw new Error(`Invalid state type: ${state.type}`);
    }
  }

  for (const transition of parsed.transitions) {
    if (!transition.from || !transition.to || !transition.type) {
      throw new Error(`Invalid transition: missing from, to, or type in ${JSON.stringify(transition)}`);
    }
  }

  return parsed;
}

export function applyToCanvas(
  exported: ExportedArchitecture
): { nodes: AppNode[]; edges: AppEdge[] } {
  // Build dagre graph for auto-layout
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 60, ranksep: 120 });

  for (const state of exported.states) {
    g.setNode(state.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  for (const transition of exported.transitions) {
    g.setEdge(transition.from, transition.to);
  }

  dagre.layout(g);

  // Convert states to nodes
  const nodes: AppNode[] = exported.states.map((state) => {
    const pos = g.node(state.id);
    const baseData = {
      type: state.type,
      label: state.label,
      description: state.description || "",
    };

    let data;
    switch (state.type) {
      case "prompt":
        data = {
          ...baseData,
          type: "prompt" as const,
          tools: state.tools || [],
          human_input: state.human_input ?? true,
          output_format: Array.isArray(state.output_format)
            ? state.output_format
            : state.output_format ? [state.output_format] : [],
          next_states: state.next_states || [],
          transition_mode: state.transition_mode || "serial",
        };
        break;
      case "decision":
        data = {
          ...baseData,
          type: "decision" as const,
          conditions: state.conditions || [],
        };
        break;
      case "humanInput":
        data = {
          ...baseData,
          type: "humanInput" as const,
          input_fields: state.input_fields || [],
        };
        break;
      case "end":
        data = {
          ...baseData,
          type: "end" as const,
          output_summary: state.output_summary || "",
        };
        break;
      default:
        data = { ...baseData, type: "start" as const };
    }

    return {
      id: state.id,
      type: state.type,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
      data,
    } as AppNode;
  });

  // Convert transitions to edges
  const edges: AppEdge[] = exported.transitions.map((transition) => ({
    id: `${transition.from}-${transition.to}`,
    source: transition.from,
    target: transition.to,
    sourceHandle: "s-right-50",
    targetHandle: "t-left-50",
    type: transition.type === "conditional" ? "conditional" : "always",
    data: {
      transition_type: transition.type,
      condition: transition.condition,
      passes: transition.passes,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: transition.type === "conditional" ? "#C4836A" : "#A89B8C",
    },
  }));

  return { nodes, edges };
}
