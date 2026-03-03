import { AlwaysEdge } from "./AlwaysEdge";
import { ConditionalEdge } from "./ConditionalEdge";
import type { EdgeTypes } from "@xyflow/react";

export const edgeTypes: EdgeTypes = {
  always: AlwaysEdge,
  conditional: ConditionalEdge,
};

export { AlwaysEdge, ConditionalEdge };
