import React from 'react';
import { motion } from 'framer-motion';
import { CountUpNumber } from '../ui/CountUpNumber';
interface ChipData {
  value: string | number;
  label: string;
  suffix?: string;
  prefix?: string;
}
interface HeroWithChipsProps {
  headline: string;
  heroValue: string | number;
  heroLabel: string;
  heroSuffix?: string;
  heroPrefix?: string;
  chips: ChipData[];
  caption?: string;
  gradient?: string;
}
export function HeroWithChips({
  headline,
  heroValue,
  heroLabel,
  heroSuffix,
  heroPrefix,
  chips,
  caption,
  gradient = 'from-indigo-400 via-purple-400 to-pink-400'
}: HeroWithChipsProps) {
  return <div className="snap-section h-screen w-full flex flex-col justify-center items-center relative p-6 bg-[#0A0A0F]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r ${gradient} opacity-[0.05] blur-[120px] rounded-full`} />
      </div>

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">
        <motion.h2 initial={{
        opacity: 0,
        y: -20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="text-xl md:text-2xl font-medium text-gray-400 mb-12 uppercase tracking-widest">
          {headline}
        </motion.h2>

        {/* Hero Metric */}
        <div className="mb-16">
          <CountUpNumber value={heroValue} prefix={heroPrefix} suffix={heroSuffix} className={`text-7xl md:text-9xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b ${gradient}`} />
          <motion.p initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="text-2xl font-semibold text-white">
            {heroLabel}
          </motion.p>
        </div>

        {/* Supporting Chips */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {chips.map((chip, index) => <motion.div key={index} initial={{
          opacity: 0,
          scale: 0.9
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.5,
          delay: 0.4 + index * 0.1
        }} className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center min-w-[160px]">
              <CountUpNumber value={chip.value} prefix={chip.prefix} suffix={chip.suffix} className="text-2xl md:text-3xl font-bold text-white mb-1" />
              <span className="text-sm text-gray-400 font-medium">
                {chip.label}
              </span>
            </motion.div>)}
        </div>

        {caption && <motion.p initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} transition={{
        duration: 0.6,
        delay: 0.8
      }} className="text-lg text-gray-500 italic">
            {caption}
          </motion.p>}
      </div>
    </div>;
}