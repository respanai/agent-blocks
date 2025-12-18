import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownIcon } from 'lucide-react';
export function HeroSection() {
  return <section className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-[#F5F5F7]">
      <div className="max-w-5xl mx-auto px-6 text-center z-10">
        <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1]
      }}>
          <h2 className="text-xl md:text-2xl font-semibold text-apple-gray mb-6 tracking-wide uppercase">
            2025 Wrap Up
          </h2>
        </motion.div>

        <motion.h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-apple-text tracking-tighter leading-tight mb-8" initial={{
        opacity: 0,
        y: 60
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1.2,
        delay: 0.2,
        ease: [0.16, 1, 0.3, 1]
      }}>
          Your Year
          <br />
          in Review.
        </motion.h1>

        <motion.p className="text-2xl md:text-3xl text-apple-gray font-medium max-w-2xl mx-auto leading-relaxed" initial={{
        opacity: 0,
        y: 40
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1.2,
        delay: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }}>
          A look back at the moments that defined your journey.
        </motion.p>
      </div>

      <motion.div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-apple-gray" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 2,
      duration: 1
    }}>
        <motion.div animate={{
        y: [0, 10, 0]
      }} transition={{
        repeat: Infinity,
        duration: 2,
        ease: 'easeInOut'
      }}>
          <ArrowDownIcon size={32} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>;
}