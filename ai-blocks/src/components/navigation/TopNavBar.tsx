// src/components/navigation/TopNavBar.tsx

"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TopNavBar() {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-700 border-b border-slate-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => router.push('/')}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Image
              src="/keywordsai_logo.svg"
              alt="Keywords AI"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-white font-bold text-xl">Agent Blocks</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => router.push('/sandbox')}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Sandbox
            </button>
            <button
              onClick={() => router.push('/games')}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Games
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}