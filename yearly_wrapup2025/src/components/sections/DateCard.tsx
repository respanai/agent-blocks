import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
interface DateCardProps {
  date: string;
  label: string;
  sublabel?: string;
  accentColor?: string;
}
export function DateCard({
  date,
  label,
  sublabel,
  accentColor = 'text-cyan-400'
}: DateCardProps) {
  return <div className="snap-section h-screen w-full flex flex-col justify-center items-center relative p-6 bg-[#0A0A0F]">
      <div className="relative z-10 text-center max-w-4xl">
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} whileInView={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.6
      }} className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10">
          <Calendar className="w-8 h-8 text-gray-300" />
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
      }} className={`text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 ${accentColor}`}>
          {date}
        </motion.div>

        <motion.h3 initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} transition={{
        duration: 0.8,
        delay: 0.4
      }} className="text-2xl md:text-3xl font-semibold text-white mb-2">
          {label}
        </motion.h3>

        {sublabel && <motion.p initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} transition={{
        duration: 0.8,
        delay: 0.5
      }} className="text-lg text-gray-400">
            {sublabel}
          </motion.p>}
      </div>
    </div>;
}