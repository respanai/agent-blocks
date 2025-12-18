import React from 'react';
import { motion } from 'framer-motion';
import { SwipeIndicator } from '../ui/SwipeIndicator';
import { Sparkles, User, Activity } from 'lucide-react';

interface IntroSectionProps {
  organizationName?: string;
}

export function IntroSection({ organizationName = 'Keywords AI' }: IntroSectionProps) {
  return <div className="snap-section h-screen w-full flex flex-col justify-center items-center relative p-6 bg-[#0A0A0F]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0A0A0F] to-[#0A0A0F]" />

      <div className="relative z-10 text-center max-w-3xl flex flex-col items-center">
        <motion.div initial={{
        scale: 0.8,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} transition={{
        duration: 1,
        ease: 'easeOut'
      }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-8">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-white">2025 Wrapped</span>
        </motion.div>

        <motion.h1 initial={{
        y: 40,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        duration: 0.8,
        delay: 0.2
      }} className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-6">
          {organizationName}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Wrapped
          </span>
        </motion.h1>

        <motion.p initial={{
        y: 20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        duration: 0.8,
        delay: 0.4
      }} className="text-xl md:text-2xl text-gray-400 font-medium mb-8">
          A year of building, observed.
        </motion.p>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.6
      }} className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">
              Powered by Keywords AI
            </span>
          </div>
        </motion.div>
      </div>

      <SwipeIndicator />
    </div>;
}
