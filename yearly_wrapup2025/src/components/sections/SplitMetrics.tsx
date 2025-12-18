import React from 'react';
import { motion } from 'framer-motion';
import { CountUpNumber } from '../ui/CountUpNumber';
interface MetricData {
  value: string | number;
  label: string;
  suffix?: string;
  prefix?: string;
  gradient?: string;
}
interface SplitMetricsProps {
  left: MetricData;
  right: MetricData;
  caption?: string;
  headline?: string;
}
export function SplitMetrics({
  left,
  right,
  caption,
  headline
}: SplitMetricsProps) {
  return <div className="snap-section h-screen w-full flex flex-col justify-center items-center relative p-6 bg-[#0A0A0F]">
      {headline && <motion.h2 initial={{
      opacity: 0,
      y: -20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }} className="absolute top-12 md:top-24 text-xl md:text-2xl font-medium text-gray-400 uppercase tracking-widest z-20">
          {headline}
        </motion.h2>}

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
        {/* Left Card */}
        <motion.div initial={{
        opacity: 0,
        x: -50
      }} whileInView={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.8,
        ease: 'easeOut'
      }} className="flex flex-col items-center justify-center p-8 md:p-16 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 h-[40vh] md:h-[60vh]">
          <CountUpNumber value={left.value} prefix={left.prefix} suffix={left.suffix} className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br ${left.gradient || 'from-indigo-400 to-purple-500'}`} />
          <span className="text-xl md:text-2xl font-medium text-gray-300 text-center">
            {left.label}
          </span>
        </motion.div>

        {/* Right Card */}
        <motion.div initial={{
        opacity: 0,
        x: 50
      }} whileInView={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.8,
        ease: 'easeOut',
        delay: 0.2
      }} className="flex flex-col items-center justify-center p-8 md:p-16 rounded-3xl bg-gradient-to-bl from-white/5 to-transparent border border-white/5 h-[40vh] md:h-[60vh]">
          <CountUpNumber value={right.value} prefix={right.prefix} suffix={right.suffix} className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-bl ${right.gradient || 'from-cyan-400 to-blue-500'}`} />
          <span className="text-xl md:text-2xl font-medium text-gray-300 text-center">
            {right.label}
          </span>
        </motion.div>
      </div>

      {caption && <motion.p initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6,
      delay: 0.6
    }} className="absolute bottom-12 md:bottom-24 text-xl text-white font-medium max-w-xl text-center px-4">
          {caption}
        </motion.p>}
    </div>;
}