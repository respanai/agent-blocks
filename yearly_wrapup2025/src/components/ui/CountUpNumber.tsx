import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';
interface CountUpNumberProps {
  value: string | number;
  className?: string;
  prefix?: string;
  suffix?: string;
}
export function CountUpNumber({
  value,
  className,
  prefix = '',
  suffix = ''
}: CountUpNumberProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    amount: 0.5
  });
  // We can't actually animate the placeholder strings like {{value}}
  // So we'll animate opacity/scale for the placeholders
  // If it were a real number, we'd use useSpring
  const isPlaceholder = typeof value === 'string' && value.includes('{{');
  return <motion.span ref={ref} className={`inline-block ${className}`} initial={{
    opacity: 0,
    y: 20,
    filter: 'blur(10px)'
  }} animate={isInView ? {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)'
  } : {
    opacity: 0,
    y: 20,
    filter: 'blur(10px)'
  }} transition={{
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1]
  }}>
      {prefix}
      {value}
      {suffix}
    </motion.span>;
}