import React from 'react';
import { motion } from 'framer-motion';
import { CountUpNumber } from '../ui/CountUpNumber';
interface StoryCardProps {
  headline: string;
  heroText: string | number;
  heroLabel: string;
  supportingText?: string;
  caption?: string;
  gradient?: string;
}
export function StoryCard({
  headline,
  heroText,
  heroLabel,
  supportingText,
  caption,
  gradient = 'from-emerald-400 to-teal-500'
}: StoryCardProps) {
  return <div className="snap-section h-screen w-full flex flex-col justify-center items-center relative p-6 bg-[#0A0A0F]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-start text-left pl-4 md:pl-0">
        <motion.div initial={{
        opacity: 0,
        x: -20
      }} whileInView={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.6
      }} className="mb-12 pl-4 border-l-2 border-indigo-500">
          <h2 className="text-xl md:text-2xl font-medium text-gray-300 uppercase tracking-widest mb-2">
            {headline}
          </h2>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.2
      }} className="mb-8">
          <div className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r ${gradient} leading-tight break-words max-w-full`}>
            {heroText}
          </div>
          <p className="text-2xl md:text-3xl font-semibold text-white">
            {heroLabel}
          </p>
        </motion.div>

        {supportingText && <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} transition={{
        duration: 0.6,
        delay: 0.5
      }} className="mb-12 px-6 py-3 rounded-full bg-white/10 border border-white/10 inline-block">
            <span className="text-lg text-gray-300">{supportingText}</span>
          </motion.div>}

        {caption && <motion.p initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} transition={{
        duration: 0.6,
        delay: 0.7
      }} className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl leading-relaxed">
            {caption}
          </motion.p>}
      </div>
    </div>;
}