import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  parallax?: boolean;
}
export function ScrollReveal({
  children,
  delay = 0,
  className = '',
  parallax = false
}: ScrollRevealProps) {
  const ref = useRef(null);
  // Parallax effect
  const {
    scrollYProgress
  } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, parallax ? -50 : 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  return <motion.div ref={ref} initial={{
    opacity: 0,
    y: 40
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: false,
    margin: '-20% 0px -20% 0px'
  }} transition={{
    duration: 1.2,
    ease: [0.16, 1, 0.3, 1],
    delay: delay
  }} style={{
    y: parallax ? y : 0
  }} className={className}>
      {children}
    </motion.div>;
}