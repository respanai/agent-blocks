import React from 'react';
import { motion } from 'framer-motion';
import { CountUpNumber } from '../ui/CountUpNumber';
interface MetricCardProps {
  value: string | number;
  label: string;
  sublabel?: string;
  gradient?: string;
  icon?: React.ReactNode;
  suffix?: string;
  prefix?: string;
}
export function MetricCard({
  value,
  label,
  sublabel,
  gradient = 'from-indigo-400 via-purple-400 to-pink-400',
  icon,
  suffix,
  prefix
}: MetricCardProps) {
  return <div className="snap-section h-screen w-full flex flex-col justify-center items-center relative p-6 overflow-hidden">
      {/* Abstract Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r ${gradient} opacity-[0.08] blur-[120px] rounded-full`} />
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center">
        {icon && <motion.div initial={{
        scale: 0,
        opacity: 0
      }} whileInView={{
        scale: 1,
        opacity: 1
      }} transition={{
        duration: 0.5,
        delay: 0.2
      }} className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            {icon}
          </motion.div>}

        <CountUpNumber value={value} prefix={prefix} suffix={suffix} className={`text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b ${gradient}`} />

        <motion.h3 initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.3
      }} className="text-2xl md:text-4xl font-semibold text-white mb-4">
          {label}
        </motion.h3>

        {sublabel && <motion.p initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} transition={{
        duration: 0.6,
        delay: 0.5
      }} className="text-lg text-gray-400 max-w-xl">
            {sublabel}
          </motion.p>}
      </div>
    </div>;
}