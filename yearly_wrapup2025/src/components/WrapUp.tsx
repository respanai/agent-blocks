import React from 'react';
import { StickyHeader } from './ui/StickyHeader';
import { IntroSection } from './sections/IntroSection';
import { HeroWithChips } from './sections/HeroWithChips';
import { SplitMetrics } from './sections/SplitMetrics';
import { GridMetrics } from './sections/GridMetrics';
import { StoryCard } from './sections/StoryCard';
import { OutroSection } from './sections/OutroSection';
import { Calendar, Zap, BarChart3 } from 'lucide-react';

const fallbackData = {
  total_requests: '1.2M',
  total_tokens: '450M',
  avg_tokens_per_request: '375',
  max_tokens_single_request: '128K',
  requests_per_active_day: '4.2K',
  top_model: 'GPT-4',
  model_used_count: '8',
  days_active: '312',
  peak_month: 'November',
  most_active_day: 'Tuesday',
  first_log_date: 'Jan 14, 2024',
  prompts_created: '142',
  prompt_used_logs: '89K',
  logs_ingested_count: '2.4M',
  traces_created_count: '156K',
  success_rate: '99.9',
  avg_latency_ms: '245',
  team_members_added: '12',
  new_users_added: '1.5K',
  organization_name: 'Keywords AI'
};

export function WrapUp() {
  return <main className="w-full h-screen bg-[#0A0A0F] text-white snap-container no-scrollbar relative">
      <StickyHeader />

      {/* 1. Intro */}
      <IntroSection organizationName={fallbackData.organization_name} />

      {/* 2. Big Picture (Hero + Chips) */}
      <HeroWithChips headline="Your year in volume" heroValue={fallbackData.total_requests} heroLabel="Total requests" chips={[{
      value: fallbackData.total_tokens,
      label: 'Tokens processed'
    }, {
      value: fallbackData.avg_tokens_per_request,
      label: 'Avg tokens/request'
    }]} gradient="from-indigo-400 via-purple-400 to-pink-400" />

      {/* 3. Power Moments (Split) */}
      <SplitMetrics headline="Power moments" left={{
      value: fallbackData.max_tokens_single_request,
      label: 'Biggest single run',
      gradient: 'from-orange-400 to-red-500'
    }} right={{
      value: fallbackData.requests_per_active_day,
      label: 'Requests per active day',
      gradient: 'from-pink-400 to-rose-500'
    }} caption="When you built, you built big." />

      {/* 4. Models (Story) */}
      <StoryCard headline="Your model DNA" heroText={fallbackData.top_model} heroLabel="Top model" supportingText={`Models used: ${fallbackData.model_used_count}`} caption="Your default choice powered most of your work." gradient="from-purple-400 to-blue-500" />

      {/* 5. Activity Cadence (Grid) */}
      <GridMetrics headline="Activity cadence" items={[{
      value: fallbackData.days_active,
      label: 'Days active',
      icon: <Zap size={24} />,
      accentColor: 'text-yellow-400'
    }, {
      value: fallbackData.peak_month,
      label: 'Peak month',
      icon: <BarChart3 size={24} />,
      accentColor: 'text-blue-400'
    }, {
      value: fallbackData.most_active_day,
      label: 'Most active day',
      icon: <Calendar size={24} />,
      accentColor: 'text-purple-400'
    }]} caption="Your build rhythm across the year." />

      {/* 6. Origin Story (Story) */}
      <StoryCard headline="It all started here" heroText={fallbackData.first_log_date} heroLabel="First log date" caption="That's when your observability timeline began." gradient="from-emerald-400 to-teal-500" />

      {/* 7. Prompts & Execution (Split) */}
      <SplitMetrics headline="Prompts & execution" left={{
      value: fallbackData.prompts_created,
      label: 'Prompts created',
      gradient: 'from-violet-400 to-fuchsia-500'
    }} right={{
      value: fallbackData.prompt_used_logs,
      label: 'Prompt-linked logs',
      gradient: 'from-fuchsia-400 to-pink-500'
    }} caption="From ideas to runs—tracked." />

      {/* 8. Observability Footprint (Split) */}
      <SplitMetrics headline="Observability footprint" left={{
      value: fallbackData.logs_ingested_count,
      label: 'Logs ingested',
      gradient: 'from-cyan-400 to-blue-500'
    }} right={{
      value: fallbackData.traces_created_count,
      label: 'Traces created',
      gradient: 'from-blue-400 to-indigo-500'
    }} caption="Signals you captured to debug and improve." />

      {/* 9. Reliability Snapshot (Hero + Chip) */}
      <HeroWithChips headline="How it performed" heroValue={fallbackData.success_rate} heroSuffix="%" heroLabel="Success rate" chips={[{
      value: fallbackData.avg_latency_ms,
      suffix: ' ms',
      label: 'Avg latency'
    }]} caption="Fast, stable, and measurable." gradient="from-green-400 to-emerald-500" />

      {/* 10. Team Growth (Split) */}
      <SplitMetrics headline="Team growth" left={{
      value: fallbackData.team_members_added,
      label: 'Team members added',
      gradient: 'from-blue-400 to-indigo-500'
    }} right={{
      value: fallbackData.new_users_added,
      label: 'New users added',
      gradient: 'from-cyan-400 to-teal-500'
    }} caption="More builders joined the journey." />

      {/* 11. Outro */}
      <OutroSection />
    </main>;
}