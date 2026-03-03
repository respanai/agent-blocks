"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";

interface TopbarProps {
  name: string;
  onNameChange: (name: string) => void;
  saveStatus: "saved" | "saving" | "unsaved" | "error";
  isPublic: boolean;
  onTogglePublic: (isPublic: boolean) => void;
  onExportYaml: () => void;
  onExportJson: () => void;
  onImportYaml: (file: File) => void;
}

export function Topbar({
  name,
  onNameChange,
  saveStatus,
  isPublic,
  onTogglePublic,
  onExportYaml,
  onExportJson,
  onImportYaml,
}: TopbarProps) {
  const { user, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameSubmit = useCallback(() => {
    setEditing(false);
    if (editValue.trim() && editValue !== name) {
      onNameChange(editValue.trim());
    } else {
      setEditValue(name);
    }
  }, [editValue, name, onNameChange]);

  const statusLabel: Record<string, { text: string; color: string }> = {
    saved: { text: "Saved", color: "text-node-start" },
    saving: { text: "Saving...", color: "text-selected" },
    unsaved: { text: "Unsaved", color: "text-node-decision" },
    error: { text: "Error saving", color: "text-node-end" },
  };

  const status = statusLabel[saveStatus];

  return (
    <div className="h-12 bg-surface border-b border-surface-light flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="text-stone-500 hover:text-stone-800 transition-colors text-sm"
        >
          &larr; Home
        </Link>
        <div className="w-px h-5 bg-surface-light" />
        {editing ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleNameSubmit();
              if (e.key === "Escape") {
                setEditValue(name);
                setEditing(false);
              }
            }}
            className="bg-transparent border-b border-selected text-stone-800 font-sans text-sm focus:outline-none px-1 py-0.5"
          />
        ) : (
          <button
            onClick={() => {
              setEditValue(name);
              setEditing(true);
            }}
            className="text-stone-800 font-sans text-sm hover:text-selected transition-colors"
          >
            {name}
          </button>
        )}
        <span className={`text-[10px] font-mono ${status.color}`}>
          {status.text}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {user && (
          <>
            <span className="text-[10px] font-mono text-stone-400">
              {user.email}
            </span>
            <button
              onClick={signOut}
              className="rounded bg-surface-light px-2 py-1 font-mono text-[10px] text-stone-500 hover:text-stone-800 transition-colors"
            >
              Sign Out
            </button>
            <div className="w-px h-5 bg-surface-light" />
          </>
        )}
        <button
          onClick={() => onTogglePublic(!isPublic)}
          className={`rounded px-3 py-1.5 font-mono text-xs transition-colors ${
            isPublic
              ? "bg-node-start/20 text-node-start hover:bg-node-start/30"
              : "bg-surface-light text-stone-500 hover:text-stone-800"
          }`}
        >
          {isPublic ? "Public" : "Private"}
        </button>
        <div className="w-px h-5 bg-surface-light" />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="rounded bg-surface-light px-3 py-1.5 font-mono text-xs text-stone-600 hover:text-stone-800 hover:bg-surface-light/80 transition-colors"
        >
          Import YAML
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".yaml,.yml"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImportYaml(file);
            e.target.value = "";
          }}
          className="hidden"
        />

        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="rounded bg-selected/20 px-3 py-1.5 font-mono text-xs text-selected hover:bg-selected/30 transition-colors"
          >
            Export &darr;
          </button>
          {showExportMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowExportMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 rounded bg-surface-light border border-surface-light shadow-lg overflow-hidden">
                <button
                  onClick={() => {
                    onExportYaml();
                    setShowExportMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 font-mono text-xs text-stone-600 hover:bg-surface hover:text-stone-800 transition-colors"
                >
                  Export YAML
                </button>
                <button
                  onClick={() => {
                    onExportJson();
                    setShowExportMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 font-mono text-xs text-stone-600 hover:bg-surface hover:text-stone-800 transition-colors"
                >
                  Export JSON
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
