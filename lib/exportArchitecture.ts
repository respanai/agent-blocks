import yaml from "js-yaml";
import type {
  AppNode,
  AppEdge,
  ExportedArchitecture,
  ExportedState,
  ExportedTransition,
} from "./types";

export function toExportSchema(
  name: string,
  description: string,
  nodes: AppNode[],
  edges: AppEdge[]
): ExportedArchitecture {
  const states: ExportedState[] = nodes.map((node) => {
    const base: ExportedState = {
      id: node.id,
      type: node.data.type,
      label: node.data.label,
      description: node.data.description,
    };

    if (node.data.type === "prompt") {
      if (node.data.tools.length > 0) base.tools = node.data.tools;
      if (node.data.human_input) base.human_input = true;
      if (node.data.output_format.length > 0) base.output_format = node.data.output_format;
      if (node.data.next_states.length > 0) base.next_states = node.data.next_states;
      if (node.data.transition_mode && node.data.transition_mode !== "serial") {
        base.transition_mode = node.data.transition_mode;
      }
    }
    if (node.data.type === "decision" && node.data.conditions.length > 0) {
      base.conditions = node.data.conditions;
    }
    if (node.data.type === "humanInput" && node.data.input_fields.length > 0) {
      base.input_fields = node.data.input_fields;
    }
    if (node.data.type === "end" && node.data.output_summary) {
      base.output_summary = node.data.output_summary;
    }

    return base;
  });

  const transitions: ExportedTransition[] = edges.map((edge) => {
    const t: ExportedTransition = {
      from: edge.source,
      to: edge.target,
      type: edge.data?.transition_type || "always",
    };
    if (edge.data?.condition) t.condition = edge.data.condition;
    if (edge.data?.passes) t.passes = edge.data.passes;
    return t;
  });

  return {
    name,
    description,
    version: "1.0",
    exported_at: new Date().toISOString(),
    states,
    transitions,
  };
}

function triggerDownload(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadYaml(data: ExportedArchitecture) {
  const content = yaml.dump(data, { lineWidth: -1, noRefs: true });
  const filename = `${data.name.replace(/\s+/g, "_").toLowerCase()}.yaml`;
  triggerDownload(content, filename, "text/yaml");
}

export function downloadJson(data: ExportedArchitecture) {
  const content = JSON.stringify(data, null, 2);
  const filename = `${data.name.replace(/\s+/g, "_").toLowerCase()}.json`;
  triggerDownload(content, filename, "application/json");
}
