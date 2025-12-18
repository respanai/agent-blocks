import React, { useState } from 'react';
import { Share2, Info, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function StickyHeader() {
  const [showAbout, setShowAbout] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleShare = () => {
    // In a real app, this would be dynamic based on the user
    const url = 'https://www.magicpatterns.com/wrapped/54vys';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return <>
      <header className="fixed top-0 right-0 p-4 z-50 flex gap-3">
        <button onClick={handleShare} className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 border border-white/5">
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          {copied ? 'Copied!' : 'Share'}
        </button>
        <button onClick={() => setShowAbout(true)} className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 rounded-full transition-all border border-white/5" aria-label="About">
          <Info size={20} />
        </button>
      </header>

      <AnimatePresence>
        {showAbout && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setShowAbout(false)}>
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} className="bg-[#1A1A20] border border-white/10 p-8 rounded-2xl max-w-md w-full relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowAbout(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold text-white mb-4">
                About Keywords AI Wrapped
              </h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Your yearly observability report, visualized. We've crunched the
                numbers on your API requests, token usage, and model performance
                to give you a complete picture of your year in AI development.
              </p>
              <p className="text-xs text-gray-600 uppercase tracking-widest">
                Version 1.0.0 • Keywords AI
              </p>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </>;
}