"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createArchitecture } from "@/lib/api";
import { AuthGuard } from "@/components/AuthGuard";

function NewContent() {
  const router = useRouter();

  useEffect(() => {
    createArchitecture()
      .then((arch) => {
        router.replace(`/${arch.id}`);
      })
      .catch((err) => {
        console.error("Failed to create architecture:", err);
        router.replace("/dashboard");
      });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-selected border-t-transparent" />
        <span className="font-mono text-sm text-stone-500">
          Creating architecture...
        </span>
      </div>
    </div>
  );
}

export default function NewArchitecturePage() {
  return (
    <AuthGuard>
      <NewContent />
    </AuthGuard>
  );
}
