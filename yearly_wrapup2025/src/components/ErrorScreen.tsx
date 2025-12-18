import React from 'react';
import { AlertCircle } from 'lucide-react';
interface ErrorScreenProps {
  onRetry: () => void;
}
export function ErrorScreen({
  onRetry
}: ErrorScreenProps) {
  return <div className="fixed inset-0 bg-[#0A0A0F] flex flex-col items-center justify-center z-50 p-6 text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
        <AlertCircle size={32} />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">
        We couldn't load your Wrapped
      </h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Something went wrong while fetching your yearly stats. Please try again
        or check back later.
      </p>
      <div className="flex gap-4">
        <button onClick={onRetry} className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
          Retry
        </button>
        <button className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors">
          Back to Dashboard
        </button>
      </div>
    </div>;
}