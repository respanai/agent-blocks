import { v4 as uuidv4 } from "uuid";
import type { XYPosition } from "@xyflow/react";
import type {
  NodeType,
  AppNode,
  StartNodeData,
  PromptNodeData,
  DecisionNodeData,
  HumanInputNodeData,
  EndNodeData,
} from "./types";

const defaults: Record<NodeType, () => StartNodeData | PromptNodeData | DecisionNodeData | HumanInputNodeData | EndNodeData> = {
  start: () => ({
    type: "start" as const,
    label: "START",
    description: "",
  }),
  prompt: () => ({
    type: "prompt" as const,
    label: "STATE",
    description: "",
    tools: [],
    human_input: true,
    output_format: [],
    next_states: [],
    transition_mode: "serial" as const,
  }),
  decision: () => ({
    type: "decision" as const,
    label: "DECISION",
    description: "",
    conditions: [],
  }),
  humanInput: () => ({
    type: "humanInput" as const,
    label: "HUMAN INPUT",
    description: "",
    input_fields: [],
  }),
  end: () => ({
    type: "end" as const,
    label: "END",
    description: "",
    output_summary: "",
  }),
};

export function createNode(type: NodeType, position: XYPosition): AppNode {
  return {
    id: uuidv4(),
    type,
    position,
    data: defaults[type](),
  } as AppNode;
}
