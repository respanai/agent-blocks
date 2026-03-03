import { StartNode } from "./StartNode";
import { PromptNode } from "./PromptNode";
import { DecisionNode } from "./DecisionNode";
import { HumanInputNode } from "./HumanInputNode";
import { EndNode } from "./EndNode";
import type { NodeTypes } from "@xyflow/react";

export const nodeTypes: NodeTypes = {
  start: StartNode,
  prompt: PromptNode,
  decision: DecisionNode,
  humanInput: HumanInputNode,
  end: EndNode,
};

export { StartNode, PromptNode, DecisionNode, HumanInputNode, EndNode };
