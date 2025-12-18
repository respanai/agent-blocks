import React from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';
interface MetricSectionProps {
  number: string;
  label: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  theme?: 'light' | 'dark';
}
export function MetricSection({
  number,
  label,
  description,
  align = 'center',
  theme = 'light'
}: MetricSectionProps) {
  const alignmentClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right'
  };
  const bgClass = theme === 'dark' ? 'bg-[#1D1D1F] text-white' : 'bg-[#F5F5F7] text-[#1D1D1F]';
  const subtextClass = theme === 'dark' ? 'text-gray-400' : 'text-[#86868B]';
  return <section className={`min-h-screen w-full flex flex-col justify-center ${bgClass} transition-colors duration-1000`}>
      <div className={`max-w-6xl mx-auto px-6 w-full flex flex-col ${alignmentClasses[align]}`}>
        <ScrollReveal parallax>
          <span className={`text-7xl md:text-9xl lg:text-[12rem] font-bold tracking-tighter leading-none block mb-4 bg-clip-text text-transparent bg-gradient-to-b ${theme === 'dark' ? 'from-white to-gray-500' : 'from-black to-gray-600'}`}>
            {number}
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <h3 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6">
            {label}
          </h3>
        </ScrollReveal>

        {description && <ScrollReveal delay={0.4}>
            <p className={`text-xl md:text-2xl ${subtextClass} max-w-xl font-medium leading-relaxed`}>
              {description}
            </p>
          </ScrollReveal>}
      </div>
    </section>;
}