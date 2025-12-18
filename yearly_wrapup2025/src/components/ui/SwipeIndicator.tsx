import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
export function SwipeIndicator() {
  return <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 pointer-events-none z-20" initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} transition={{
    delay: 1,
    duration: 1
  }}>
      <span className="text-xs font-medium uppercase tracking-widest">
        Swipe Up
      </span>
      <motion.div animate={{
      y: [0, -10, 0]
    }} transition={{
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut'
    }}>
        <ChevronUp className="w-6 h-6" />
      </motion.div>
    </motion.div>;
}