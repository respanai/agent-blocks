import React from 'react';
import { motion } from 'framer-motion';
import { Share2, ArrowLeft } from 'lucide-react';
export function OutroSection() {
  return <div className="snap-section h-screen w-full flex flex-col justify-center items-center relative p-6 bg-[#0A0A0F]">
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 to-transparent" />

      <div className="relative z-10 text-center max-w-2xl w-full">
        <motion.h2 initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          That's your year in
          <br />
          <span className="text-indigo-400">Keywords AI.</span>
        </motion.h2>

        <motion.p initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} transition={{
        duration: 0.8,
        delay: 0.2
      }} className="text-xl text-gray-400 mb-12">
          Share your journey with your team.
        </motion.p>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.4
      }} className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto">
            <Share2 size={20} />
            Share your Wrapped
          </button>

          <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto border border-white/10">
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-8 text-center w-full">
        <p className="text-xs text-gray-600 uppercase tracking-widest">
          Powered by Keywords AI Observability
        </p>
      </div>
    </div>;
}