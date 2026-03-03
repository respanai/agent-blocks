"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { getPublicArchitectures, incrementArchitectureViews } from "@/lib/api";
import type { Architecture } from "@/lib/types";

type Tab = "product" | "contact" | "showcases";

// ─── Design System Primitives ────────────────────────────────

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-surface border border-surface-light p-8 ${className}`}>
      {children}
    </div>
  );
}

function AccentCard({ children, color = "selected", className = "" }: { children: ReactNode; color?: string; className?: string }) {
  const colors: Record<string, string> = {
    selected: "border-selected/40 bg-selected/5",
    prompt: "border-node-prompt/30 bg-node-prompt/5",
  };
  return (
    <div className={`rounded-2xl border-2 ${colors[color] ?? colors.selected} p-8 ${className}`}>
      {children}
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-6">{children}</p>;
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center shrink-0 ${className}`}>
      <div className="w-6 lg:w-10 h-0.5 bg-stone-300" />
      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-stone-300" />
    </div>
  );
}

function NodeChip({ label, type }: { label: string; type: "start" | "prompt" | "decision" | "human" | "end" }) {
  const styles: Record<string, string> = {
    start:    "border-node-start    bg-node-start/10    text-node-start",
    prompt:   "border-node-prompt   bg-node-prompt/10   text-node-prompt",
    decision: "border-node-decision bg-node-decision/10 text-node-decision",
    human:    "border-node-human    bg-node-human/10    text-node-human",
    end:      "border-node-end      bg-node-end/10      text-node-end",
  };
  return (
    <div className={`rounded-lg border-2 px-4 py-2 ${styles[type]}`}>
      <span className="font-mono text-sm font-bold">{label}</span>
    </div>
  );
}

function NodeFlow({ nodes }: { nodes: { label: string; type: "start" | "prompt" | "decision" | "human" | "end" }[] }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {nodes.map((n, i) => (
        <div key={n.label} className="flex items-center gap-2">
          <NodeChip label={n.label} type={n.type} />
          {i < nodes.length - 1 && <Arrow />}
        </div>
      ))}
    </div>
  );
}

function BranchLine({ color = "node-prompt" }: { color?: string }) {
  const c: Record<string, string> = {
    "node-prompt": "bg-node-prompt/30",
    "node-decision": "bg-node-decision/30",
  };
  return <div className={`w-6 lg:w-8 h-0.5 shrink-0 ${c[color] ?? c["node-prompt"]}`} />;
}

// ─── Product Tab ─────────────────────────────────────────────

function ProductTab() {
  return (
    <div className="space-y-24 pb-16">
      {/* Hero */}
      <section className="pt-12 lg:pt-20 space-y-8">
        <h2 className="text-5xl lg:text-7xl font-mono font-bold text-stone-800 leading-[1.1] max-w-4xl">
          Everyone is solving how agents run.
        </h2>
        <h2 className="text-5xl lg:text-7xl font-mono font-bold text-selected leading-[1.1] max-w-4xl">
          Nobody is solving how agents think.
        </h2>
        <p className="text-xl lg:text-2xl text-stone-500 font-sans max-w-2xl leading-relaxed pt-4">
          A mental model for AI Agents that anyone can understand &mdash; no code required.
        </p>
      </section>

      {/* Section: Wrong way */}
      <section className="space-y-8">
        <h3 className="text-3xl lg:text-4xl font-mono font-bold text-stone-800 max-w-3xl">
          You might be thinking about Agents wrong
        </h3>
        <div className="max-w-3xl space-y-4">
          <p className="text-lg text-stone-600 font-sans leading-relaxed">
            In the past year, everyone has been talking about AI Agents. LangGraph, AutoGen, CrewAI &mdash;
            framework after framework, tutorial after tutorial, all telling you how to &ldquo;run&rdquo; an agent.
          </p>
          <p className="text-lg text-stone-600 font-sans leading-relaxed">
            But before you start building, there&apos;s a more fundamental question nobody helps you answer:
          </p>
        </div>
        <AccentCard className="max-w-3xl">
          <p className="text-2xl lg:text-3xl font-mono font-bold text-stone-800">
            What is an Agent, really?
          </p>
          <p className="text-lg text-stone-500 font-sans mt-4 leading-relaxed">
            Not &ldquo;an AI system that can autonomously complete tasks.&rdquo;
            But: what is its internal structure? How do you design it?
            How do you communicate what&apos;s in your head to an engineer?
          </p>
        </AccentCard>
      </section>

      {/* Section: Graph Theory */}
      <section className="space-y-8">
        <h3 className="text-3xl lg:text-4xl font-mono font-bold text-stone-800">
          Starting from Graph Theory
        </h3>
        <p className="text-lg text-stone-600 font-sans leading-relaxed max-w-3xl">
          All complex things are graphs underneath.
          Graph theory is one of the simplest concepts in mathematics:
        </p>
        <Card>
          <div className="flex items-center gap-6 lg:gap-10 flex-wrap">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl border-2 border-node-prompt bg-node-prompt/10 flex items-center justify-center">
                <span className="text-2xl lg:text-3xl font-mono font-bold text-node-prompt">N</span>
              </div>
              <span className="text-sm font-mono text-stone-400">Node</span>
            </div>
            <span className="text-3xl lg:text-4xl font-mono text-stone-300">+</span>
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 lg:w-24 flex items-center">
                <Arrow className="w-full" />
              </div>
              <span className="text-sm font-mono text-stone-400">Edge</span>
            </div>
            <span className="text-3xl lg:text-4xl font-mono text-stone-300">=</span>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <NodeChip label="A" type="start" />
                <Arrow />
                <NodeChip label="B" type="decision" />
                <Arrow />
                <NodeChip label="C" type="prompt" />
              </div>
              <span className="text-sm font-mono text-stone-400">Graph</span>
            </div>
          </div>
        </Card>
        <p className="text-lg text-stone-600 font-sans leading-relaxed max-w-3xl">
          City maps are graphs. Social networks are graphs. Your org chart is a graph.
          Graph theory doesn&apos;t care what&apos;s inside the nodes &mdash; only how they connect.
        </p>
      </section>

      {/* Section: FSM */}
      <section className="space-y-8">
        <h3 className="text-3xl lg:text-4xl font-mono font-bold text-stone-800">
          Graphs + Rules = FSM
        </h3>
        <p className="text-lg text-stone-600 font-sans leading-relaxed max-w-3xl">
          A <strong>Finite State Machine (FSM)</strong> is a graph with two constraints:
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="text-4xl font-mono font-bold text-surface-light mb-4">01</div>
            <p className="text-xl font-mono font-bold text-stone-800 mb-2">Nodes become States</p>
            <p className="text-base text-stone-500 font-sans leading-relaxed">
              Finite in number &mdash; you define all possible states upfront.
              No surprises, no emergent states.
            </p>
          </Card>
          <Card>
            <div className="text-4xl font-mono font-bold text-surface-light mb-4">02</div>
            <p className="text-xl font-mono font-bold text-stone-800 mb-2">Edges become Transitions</p>
            <p className="text-base text-stone-500 font-sans leading-relaxed">
              Conditional &mdash; you only move from one state to another
              when a specific condition is met.
            </p>
          </Card>
        </div>
        <Card>
          <Label>Example: Traffic Light FSM</Label>
          <div className="flex items-center gap-3 lg:gap-6 flex-wrap">
            <NodeChip label="Red" type="end" />
            <Arrow />
            <NodeChip label="Green" type="start" />
            <Arrow />
            <NodeChip label="Yellow" type="decision" />
            <Arrow />
            <span className="text-base font-mono text-stone-400">loop</span>
          </div>
          <p className="text-base text-stone-500 font-sans mt-6">
            Three states. Three transitions. Looping forever. The core value of FSM is <strong className="text-stone-700">predictability</strong>.
          </p>
        </Card>
      </section>

      {/* Section: Agent = FSM + LLM */}
      <section className="space-y-8">
        <h3 className="text-3xl lg:text-4xl font-mono font-bold text-stone-800 max-w-3xl">
          An Agent is an FSM, but the LLM decides the transitions
        </h3>
        <p className="text-lg text-stone-600 font-sans leading-relaxed max-w-3xl">
          An AI Agent is essentially an FSM with one difference:
          <strong> transition conditions are decided by the LLM&apos;s output, not hardcoded.</strong>
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <Label>Traditional FSM</Label>
            <div className="space-y-3 font-mono">
              <p className="text-lg text-stone-700"><span className="text-stone-400">if</span> user clicks &ldquo;confirm&rdquo;</p>
              <div className="flex items-center gap-3 pl-6">
                <Arrow />
                <span className="text-lg text-stone-700">next state</span>
              </div>
            </div>
          </Card>
          <AccentCard>
            <Label>Agent</Label>
            <div className="space-y-3 font-mono">
              <p className="text-lg text-stone-700"><span className="text-selected/60">if</span> LLM judges &ldquo;task complete&rdquo;</p>
              <div className="flex items-center gap-3 pl-6">
                <Arrow />
                <span className="text-lg text-stone-700">next state</span>
              </div>
              <p className="text-lg text-stone-700 mt-2"><span className="text-selected/60">if</span> LLM judges &ldquo;need more info&rdquo;</p>
              <div className="flex items-center gap-3 pl-6">
                <Arrow />
                <span className="text-lg text-stone-700">previous state</span>
              </div>
            </div>
          </AccentCard>
        </div>
        <Card>
          <div className="space-y-3 font-mono text-lg lg:text-xl">
            <p className="text-stone-400">Graph Theory <span className="text-stone-300">&mdash; structure</span></p>
            <p className="pl-8 text-stone-500">&rarr; FSM <span className="text-stone-300">&mdash; graph + deterministic rules</span></p>
            <p className="pl-16 text-stone-800 font-bold">&rarr; Agent <span className="text-stone-400 font-normal">&mdash; FSM + LLM decides transitions</span></p>
          </div>
        </Card>
      </section>

      {/* Section: Prompt is first-class */}
      <section className="space-y-8">
        <h3 className="text-3xl lg:text-4xl font-mono font-bold text-stone-800">
          Prompt is the First-Class Citizen
        </h3>
        <p className="text-lg text-stone-600 font-sans leading-relaxed max-w-3xl">
          If an agent is an FSM, what goes inside each state? <strong>A Prompt.</strong> Each state corresponds to a prompt that defines what to do, how to think, what format to output.
        </p>
        <Card>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <NodeChip label="Prompt" type="prompt" />
              <span className="text-sm font-mono text-stone-400">core</span>
            </div>
            <div className="pl-8 lg:pl-12 space-y-3">
              <div className="flex items-center gap-4">
                <BranchLine />
                <NodeChip label="Tools" type="start" />
                <span className="text-sm text-stone-400 font-sans">&mdash; tells the model which tools to call</span>
              </div>
              <div className="flex items-center gap-4">
                <BranchLine />
                <NodeChip label="Memory" type="human" />
                <span className="text-sm text-stone-400 font-sans">&mdash; injected into prompt context</span>
              </div>
              <div className="flex items-center gap-4">
                <BranchLine />
                <NodeChip label="Format" type="decision" />
                <span className="text-sm text-stone-400 font-sans">&mdash; demands structured output</span>
              </div>
            </div>
          </div>
        </Card>
        <AccentCard color="prompt" className="max-w-3xl">
          <p className="text-2xl font-mono font-bold text-stone-800">
            Designing an agent is designing a state graph of prompts.
          </p>
        </AccentCard>
      </section>

      {/* Section: Two patterns */}
      <section className="space-y-8">
        <h3 className="text-3xl lg:text-4xl font-mono font-bold text-stone-800">
          Two Fundamental Patterns
        </h3>
        <p className="text-lg text-stone-600 font-sans leading-relaxed max-w-3xl">
          All agents reduce to two basic structures, or a combination:
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <p className="text-xl font-mono font-bold text-stone-800 mb-6">Pipeline</p>
            <NodeFlow nodes={[
              { label: "Draft", type: "prompt" },
              { label: "Check", type: "prompt" },
              { label: "Format", type: "prompt" },
              { label: "End", type: "end" },
            ]} />
            <p className="text-base text-stone-500 font-sans leading-relaxed mt-6">
              Fixed sequence. A&apos;s output feeds B, B feeds C. Good for deterministic flows.
            </p>
          </Card>
          <Card>
            <p className="text-xl font-mono font-bold text-stone-800 mb-6">Orchestrator + Workers</p>
            <div className="space-y-3">
              <NodeChip label="Orchestrator" type="decision" />
              <div className="pl-6 space-y-2">
                {(["Search", "Write", "Review"] as const).map((w) => (
                  <div key={w} className="flex items-center gap-3">
                    <BranchLine color="node-decision" />
                    <NodeChip label={w} type="prompt" />
                  </div>
                ))}
                <p className="text-xs font-mono text-stone-400 pl-10">&uarr; results flow back</p>
              </div>
            </div>
            <p className="text-base text-stone-500 font-sans leading-relaxed mt-6">
              Main prompt has global vision, delegates to specialized workers. Good for dynamic flows.
            </p>
          </Card>
        </div>
        <p className="text-lg text-stone-600 font-sans leading-relaxed max-w-3xl">
          The fundamental difference: <strong>who makes decisions.</strong> In a pipeline,
          each prompt only knows its next step. An orchestrator has global vision and coordinates everything.
        </p>
      </section>

      {/* Section: Design gap */}
      <section className="space-y-8">
        <h3 className="text-3xl lg:text-4xl font-mono font-bold text-stone-800 max-w-3xl">
          The Design Layer is Empty
        </h3>
        <p className="text-lg text-stone-600 font-sans leading-relaxed max-w-3xl">
          Every agent tool on the market solves the same problem: <strong>how to run an agent.</strong>
          The design layer &mdash; the questions you need before writing code &mdash; is blank:
        </p>
        <div className="space-y-4 max-w-3xl">
          {[
            "How many prompt states does this agent have?",
            "How does information flow between prompts?",
            "What conditions trigger a jump forward, a loop back?",
            "Where are the loops, and when do they terminate?",
            "What tools does each prompt node have access to?",
          ].map((q) => (
            <div key={q} className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-selected mt-2.5 shrink-0" />
              <p className="text-lg text-stone-600 font-sans">{q}</p>
            </div>
          ))}
        </div>
        <AccentCard className="max-w-3xl">
          <p className="text-2xl lg:text-3xl font-mono font-bold text-stone-800">
            Agent Architect fills this gap.
          </p>
          <p className="text-lg text-stone-500 font-sans mt-4 leading-relaxed">
            A canvas where you drag prompt nodes, define transition conditions,
            annotate tool mount points &mdash; and export your design as YAML or JSON.
          </p>
        </AccentCard>
      </section>

    </div>
  );
}

// ─── Contact Tab ─────────────────────────────────────────────

function ContactTab() {
  return (
    <div className="pb-16">
      <section className="pt-12 lg:pt-20 space-y-4 mb-16">
        <h2 className="text-4xl lg:text-5xl font-mono font-bold text-stone-800">Contact</h2>
        <p className="text-xl text-stone-500 font-sans max-w-xl">
          Questions, partnerships, or custom needs &mdash; reach out.
        </p>
      </section>

      <Card className="max-w-xl space-y-8">
        <div>
          <p className="text-2xl font-mono font-bold text-stone-800">Get in touch</p>
          <p className="text-base text-stone-500 font-sans mt-3 leading-relaxed">
            Whether you need unlimited architectures, custom integrations,
            team analytics, or just want to chat about agent design.
          </p>
        </div>
        <a
          href="mailto:frank@respan.ai"
          className="block rounded-xl bg-selected/20 px-6 py-4 font-mono text-lg text-selected hover:bg-selected/30 transition-colors"
        >
          frank@respan.ai
        </a>
      </Card>
    </div>
  );
}

// ─── Showcases Tab ───────────────────────────────────────────

function mapNodeType(type: string): "start" | "prompt" | "decision" | "human" | "end" {
  if (type === "humanInput") return "human";
  if (["start", "prompt", "decision", "end"].includes(type)) return type as "start" | "prompt" | "decision" | "end";
  return "prompt";
}

function ShowcasesTab() {
  const [architectures, setArchitectures] = useState<Architecture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicArchitectures()
      .then(setArchitectures)
      .catch(() => setArchitectures([]))
      .finally(() => setLoading(false));
  }, []);

  const handleClick = (arch: Architecture) => {
    // Increment views optimistically
    setArchitectures((prev) =>
      prev.map((a) =>
        a.id === arch.id ? { ...a, views: (a.views ?? 0) + 1 } : a
      )
    );
    incrementArchitectureViews(arch.id);
    // Open architecture in new tab (requires auth)
    window.open(`/${arch.id}`, "_blank");
  };

  return (
    <div className="pb-16">
      <section className="pt-12 lg:pt-20 space-y-4 mb-16">
        <h2 className="text-4xl lg:text-5xl font-mono font-bold text-stone-800">Showcases</h2>
        <p className="text-xl text-stone-500 font-sans max-w-2xl">
          Public agent architectures shared by the community. Sorted by views.
        </p>
      </section>

      {loading ? (
        <div className="flex items-center gap-3 py-12">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-selected border-t-transparent" />
          <span className="font-mono text-sm text-stone-500">Loading...</span>
        </div>
      ) : architectures.length === 0 ? (
        <Card className="max-w-2xl">
          <p className="text-xl font-mono font-bold text-stone-800 mb-3">No public architectures yet</p>
          <p className="text-base text-stone-500 font-sans leading-relaxed">
            Public architectures will appear here when users share them.
            Open an architecture and click &ldquo;Public&rdquo; in the toolbar to share yours.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {architectures.map((arch) => {
            const nodes = arch.graph?.nodes ?? [];
            const views = arch.views ?? 0;
            return (
              <button
                key={arch.id}
                onClick={() => handleClick(arch)}
                className="text-left"
              >
                <Card className="space-y-6 hover:border-selected/40 transition-colors cursor-pointer">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xl font-mono font-bold text-stone-800">{arch.name}</p>
                      <span className="text-xs font-mono text-stone-400 shrink-0 ml-4">
                        {views} view{views !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {arch.description && (
                      <p className="text-base text-stone-500 font-sans leading-relaxed">{arch.description}</p>
                    )}
                    <p className="text-xs font-mono text-stone-400 mt-2">
                      {nodes.length} node{nodes.length !== 1 ? "s" : ""} &middot; {arch.graph?.edges?.length ?? 0} edge{(arch.graph?.edges?.length ?? 0) !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {nodes.length > 0 && (
                    <NodeFlow
                      nodes={nodes.slice(0, 6).map((n) => ({
                        label: (n.data as { label?: string }).label || "Node",
                        type: mapNodeType((n.data as { type?: string }).type || "prompt"),
                      }))}
                    />
                  )}
                </Card>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Landing Page ────────────────────────────────────────────

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("product");
  const { user } = useAuth();

  const tabs: { key: Tab; label: string }[] = [
    { key: "product", label: "Product" },
    { key: "showcases", label: "Showcases" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-canvas/80 backdrop-blur-sm border-b border-surface-light">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-mono font-bold text-stone-800">
            Agent Architect
          </h1>
          <div className="flex items-center gap-2">
            <nav className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-lg px-4 py-2 font-mono text-sm transition-colors ${
                    activeTab === tab.key
                      ? "bg-selected/20 text-selected"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <div className="ml-4 pl-4 border-l border-surface-light">
              {user ? (
                <Link href="/dashboard" className="rounded-lg bg-selected/20 px-4 py-2 font-mono text-sm text-selected hover:bg-selected/30 transition-colors">
                  Dashboard
                </Link>
              ) : (
                <Link href="/login" className="rounded-lg bg-surface-light px-4 py-2 font-mono text-sm text-stone-600 hover:text-stone-800 transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8">
        {activeTab === "product" && <ProductTab />}
        {activeTab === "showcases" && <ShowcasesTab />}
        {activeTab === "contact" && <ContactTab />}
      </main>

      <footer className="border-t border-surface-light py-8 mt-16">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-between text-sm text-stone-400 font-mono">
          <span>Agent Architect</span>
          <a href="mailto:frank@respan.ai" className="hover:text-selected transition-colors">
            frank@respan.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
