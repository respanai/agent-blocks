// src/app/games/20-questions/page.tsx

"use client";
import GameInterface from '@/components/games/twenty-questions/GameInterface';
import TopNavBar from '@/components/navigation/TopNavBar';
import { GameState } from '@/types/games';

export default function TwentyQuestionsPage() {
  const handleGameEnd = (gameState: GameState) => {
    // Could add analytics or logging here
    console.log('Game completed:', gameState);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavBar />
      
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-16">
        <div className="py-8">
          <GameInterface onGameEnd={handleGameEnd} />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-slate-600">
            Powered by{' '}
            <a 
              href="https://keywordsai.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Keywords AI
            </a>
            {' '}• Experience the power of AI reasoning
          </p>
        </div>
      </footer>
    </div>
  );
}