"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { updateArchitecture } from "./api";
import type { AppNode, AppEdge } from "./types";

export type SaveStatus = "saved" | "saving" | "unsaved" | "error";

export function useAutoSave(architectureId: string) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<{
    name?: string;
    graph?: { nodes: AppNode[]; edges: AppEdge[] };
  } | null>(null);
  const isInitialRef = useRef(true);

  const flush = useCallback(async () => {
    if (!pendingRef.current) return;
    const updates = pendingRef.current;
    pendingRef.current = null;

    setSaveStatus("saving");
    try {
      await updateArchitecture(architectureId, updates);
      setSaveStatus("saved");
    } catch (err) {
      console.error("Auto-save failed:", err);
      setSaveStatus("error");
    }
  }, [architectureId]);

  const scheduleSave = useCallback(
    (updates: { name?: string; graph?: { nodes: AppNode[]; edges: AppEdge[] } }) => {
      if (isInitialRef.current) {
        isInitialRef.current = false;
        return;
      }

      pendingRef.current = { ...pendingRef.current, ...updates };
      setSaveStatus("unsaved");

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flush, 500);
    },
    [flush]
  );

  const saveGraph = useCallback(
    (nodes: AppNode[], edges: AppEdge[]) => {
      scheduleSave({ graph: { nodes, edges } });
    },
    [scheduleSave]
  );

  const saveName = useCallback(
    (name: string) => {
      // Name changes should not be skipped on initial
      pendingRef.current = { ...pendingRef.current, name };
      setSaveStatus("unsaved");

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flush, 500);
    },
    [flush]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { saveStatus, saveGraph, saveName };
}
