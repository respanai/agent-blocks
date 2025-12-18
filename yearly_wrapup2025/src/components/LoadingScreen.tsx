import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
export function LoadingScreen() {
  return <div className="fixed inset-0 bg-[#0A0A0F] flex flex-col items-center justify-center z-50">
      <motion.div animate={{
      rotate: 360
    }} transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }} className="mb-6">
        <Loader2 className="w-12 h-12 text-indigo-500" />
      </motion.div>
      <motion.h2 initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.2
    }} className="text-xl font-medium text-white">
        Loading your Wrapped...
      </motion.h2>
    </div>;
}