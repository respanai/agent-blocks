import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export function StickyHeader() {
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
      </header>
    </>;
}