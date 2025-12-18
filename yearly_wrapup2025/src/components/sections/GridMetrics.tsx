import React from 'react';
import { motion } from 'framer-motion';
import { CountUpNumber } from '../ui/CountUpNumber';
import { Calendar, Zap, BarChart3 } from 'lucide-react';
interface GridItem {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  accentColor?: string;
}
interface GridMetricsProps {
  headline: string;
  items: [GridItem, GridItem, GridItem];
  caption?: string;
}
export function GridMetrics({
  headline,
  items,
  caption
}: GridMetricsProps) {
  return <div className="snap-section h-screen w-full flex flex-col justify-center items-center relative p-6 bg-[#0A0A0F]">
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

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
        {items.map((item, index) => <motion.div key={index} initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: index * 0.15
      }} className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm min-h-[200px] md:min-h-[300px]">
            {item.icon && <div className={`mb-6 p-3 rounded-full bg-white/5 ${item.accentColor || 'text-white'}`}>
                {item.icon}
              </div>}
            <CountUpNumber value={item.value} className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center ${item.accentColor || 'text-white'}`} />
            <span className="text-sm md:text-base font-medium text-gray-400 uppercase tracking-wide text-center">
              {item.label}
            </span>
          </motion.div>)}
      </div>

      {caption && <motion.p initial={{
      opacity: 0
    }} whileInView={{
      opacity: 1
    }} transition={{
      duration: 0.6,
      delay: 0.6
    }} className="text-lg text-gray-500 italic">
          {caption}
        </motion.p>}
    </div>;
}