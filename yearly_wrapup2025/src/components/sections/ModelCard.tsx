import React from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
interface ModelCardProps {
  topModel: string;
  modelCount: string;
}
export function ModelCard({
  topModel,
  modelCount
}: ModelCardProps) {
  return <div className="snap-section h-screen w-full flex flex-col justify-center items-center relative p-6 bg-[#0A0A0F]">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />

      <div className="relative z-10 text-center max-w-4xl w-full">
        <motion.div initial={{
        scale: 0,
        opacity: 0
      }} whileInView={{
        scale: 1,
        opacity: 1
      }} transition={{
        duration: 0.5
      }} className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-purple-500/20">
          <Cpu className="w-10 h-10 text-white" />
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.7,
        delay: 0.2
      }}>
          <h2 className="text-2xl font-medium text-gray-400 mb-4">
            Your Top Model
          </h2>
          <div className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight break-words">
            {topModel}
          </div>
        </motion.div>

        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} transition={{
        duration: 0.7,
        delay: 0.5
      }} className="inline-block px-6 py-3 rounded-full bg-white/5 border border-white/10">
          <span className="text-lg text-gray-300">
            Total models used:{' '}
            <span className="text-white font-bold">{modelCount}</span>
          </span>
        </motion.div>
      </div>
    </div>;
}