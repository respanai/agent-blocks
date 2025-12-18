import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';
export function ClosingSection() {
  return <section className="min-h-screen w-full flex flex-col justify-center items-center bg-white relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <ScrollReveal>
          <h2 className="text-5xl md:text-7xl font-bold text-apple-text tracking-tighter mb-12">
            Here's to another
            <br />
            incredible year.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0071e3] text-white rounded-full text-xl font-medium transition-all hover:bg-[#0077ED] hover:scale-105 active:scale-95">
            <span>Start 2024 Journey</span>
            <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </ScrollReveal>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-left border-t border-gray-100 pt-12">
          <ScrollReveal delay={0.5}>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
              Focus
            </h4>
            <p className="text-gray-500">
              Stay dedicated to your core mission and values.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.6}>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
              Create
            </h4>
            <p className="text-gray-500">
              Build things that bring joy and utility to others.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.7}>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
              Grow
            </h4>
            <p className="text-gray-500">
              Learn from every challenge and success.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <footer className="absolute bottom-8 text-sm text-gray-400">
        Designed with Magic Patterns
      </footer>
    </section>;
}