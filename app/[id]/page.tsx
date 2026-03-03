"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReactFlowProvider, useNodesState, useEdgesState } from "@xyflow/react";
import { getArchitecture, toggleArchitecturePublic } from "@/lib/api";
import { useAutoSave } from "@/lib/useAutoSave";
import {
  toExportSchema,
  downloadYaml,
  downloadJson,
} from "@/lib/exportArchitecture";
import { parseYaml, applyToCanvas } from "@/lib/importArchitecture";
import { Canvas } from "@/components/Canvas";
import { NodeToolbar } from "@/components/NodeToolbar";
import { Inspector } from "@/components/Inspector";
import { Topbar } from "@/components/Topbar";
import { AuthGuard } from "@/components/AuthGuard";
import type { Architecture, AppNode, AppEdge } from "@/lib/types";

function ArchitectureEditor({ architecture }: { architecture: Architecture }) {
  const [name, setName] = useState(architecture.name);
  const [isPublic, setIsPublic] = useState(architecture.is_public ?? false);
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(
    architecture.graph?.nodes || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>(
    architecture.graph?.edges || []
  );

  const { saveStatus, saveGraph, saveName } = useAutoSave(architecture.id);

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  nodesRef.current = nodes;
  edgesRef.current = edges;

  const onGraphChange = useCallback(() => {
    // Use a microtask to ensure we get the latest state after React batches
    queueMicrotask(() => {
      saveGraph(nodesRef.current, edgesRef.current);
    });
  }, [saveGraph]);

  const handleNameChange = useCallback(
    (newName: string) => {
      setName(newName);
      saveName(newName);
    },
    [saveName]
  );

  const handleExportYaml = useCallback(() => {
    const data = toExportSchema(name, architecture.description, nodes, edges);
    downloadYaml(data);
  }, [name, architecture.description, nodes, edges]);

  const handleExportJson = useCallback(() => {
    const data = toExportSchema(name, architecture.description, nodes, edges);
    downloadJson(data);
  }, [name, architecture.description, nodes, edges]);

  const handleTogglePublic = useCallback(
    async (value: boolean) => {
      setIsPublic(value);
      try {
        await toggleArchitecturePublic(architecture.id, value);
      } catch {
        setIsPublic(!value);
      }
    },
    [architecture.id]
  );

  const handleImportYaml = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const yamlString = e.target?.result as string;
          const exported = parseYaml(yamlString);
          const { nodes: newNodes, edges: newEdges } = applyToCanvas(exported);
          setNodes(newNodes);
          setEdges(newEdges);
          if (exported.name) setName(exported.name);
          // Trigger save after import
          queueMicrotask(() => {
            saveGraph(newNodes, newEdges);
            if (exported.name) saveName(exported.name);
          });
        } catch (err) {
          alert(`Failed to import YAML: ${(err as Error).message}`);
        }
      };
      reader.readAsText(file);
    },
    [setNodes, setEdges, saveGraph, saveName]
  );

  return (
    <div className="h-screen flex flex-col">
      <Topbar
        name={name}
        onNameChange={handleNameChange}
        saveStatus={saveStatus}
        isPublic={isPublic}
        onTogglePublic={handleTogglePublic}
        onExportYaml={handleExportYaml}
        onExportJson={handleExportJson}
        onImportYaml={handleImportYaml}
      />
      <div className="flex flex-1 overflow-hidden">
        <NodeToolbar />
        <Canvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          setNodes={setNodes}
          setEdges={setEdges}
          onGraphChange={onGraphChange}
        />
        <Inspector onGraphChange={onGraphChange} />
      </div>
    </div>
  );
}

function ArchitecturePageContent() {
  const params = useParams();
  const router = useRouter();
  const [architecture, setArchitecture] = useState<Architecture | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    getArchitecture(id)
      .then((arch) => {
        if (!arch) {
          router.replace("/dashboard");
          return;
        }
        setArchitecture(arch);
      })
      .catch((err) => {
        console.error("Failed to load architecture:", err);
        router.replace("/dashboard");
      })
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-selected border-t-transparent" />
          <span className="font-mono text-sm text-stone-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (!architecture) return null;

  return (
    <ReactFlowProvider>
      <ArchitectureEditor architecture={architecture} />
    </ReactFlowProvider>
  );
}

export default function ArchitecturePage() {
  return (
    <AuthGuard>
      <ArchitecturePageContent />
    </AuthGuard>
  );
}
