import type { Node, Edge } from "@xyflow/react";

// ─── Node Types ───────────────────────────────────────────────

export type NodeType = "start" | "prompt" | "decision" | "humanInput" | "end";

export interface StartNodeData extends Record<string, unknown> {
  type: "start";
  label: string;
  description: string;
}

export type TransitionMode = "serial" | "router" | "parallel";

export interface PromptNodeData extends Record<string, unknown> {
  type: "prompt";
  label: string;
  description: string;
  tools: string[];
  human_input: boolean;
  output_format: string[];
  next_states: string[];
  transition_mode: TransitionMode;
}

export interface DecisionNodeData extends Record<string, unknown> {
  type: "decision";
  label: string;
  description: string;
  conditions: string[];
}

export interface HumanInputNodeData extends Record<string, unknown> {
  type: "humanInput";
  label: string;
  description: string;
  input_fields: string[];
}

export interface EndNodeData extends Record<string, unknown> {
  type: "end";
  label: string;
  description: string;
  output_summary: string;
}

export type AppNodeData =
  | StartNodeData
  | PromptNodeData
  | DecisionNodeData
  | HumanInputNodeData
  | EndNodeData;

export type AppNode = Node<AppNodeData, NodeType>;

// ─── Edge Types ───────────────────────────────────────────────

export type EdgeType = "always" | "conditional";

export interface AppEdgeData extends Record<string, unknown> {
  transition_type: EdgeType;
  condition?: string;
  passes?: string;
}

export type AppEdge = Edge<AppEdgeData>;

// ─── Supabase Row ─────────────────────────────────────────────

export interface Architecture {
  id: string;
  name: string;
  description: string;
  graph: {
    nodes: AppNode[];
    edges: AppEdge[];
  };
  team_id?: string;
  is_public?: boolean;
  views?: number;
  created_at: string;
  updated_at: string;
}

// ─── Teams ────────────────────────────────────────────────────

export interface Team {
  id: string;
  name: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
}

export interface TeamInvite {
  id: string;
  team_id: string;
  email: string;
  invited_by: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  teams?: { name: string };
}

export interface TeamMemberWithEmail {
  id: string;
  user_id: string;
  role: string;
  email: string;
  created_at: string;
}

// ─── Export Schema ────────────────────────────────────────────

export interface ExportedState {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  tools?: string[];
  human_input?: boolean;
  output_format?: string | string[];
  next_states?: string[];
  transition_mode?: TransitionMode;
  conditions?: string[];
  input_fields?: string[];
  output_summary?: string;
}

export interface ExportedTransition {
  from: string;
  to: string;
  type: EdgeType;
  condition?: string;
  passes?: string;
}

export interface ExportedArchitecture {
  name: string;
  description: string;
  version: string;
  exported_at: string;
  states: ExportedState[];
  transitions: ExportedTransition[];
}
