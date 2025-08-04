// src/components/games/twenty-questions/ProgressTracker.tsx

import { GameState } from '@/types/games';

interface ProgressTrackerProps {
  gameState: GameState;
}

export default function ProgressTracker({ gameState }: ProgressTrackerProps) {
  const progress = (gameState.questionsAsked / gameState.maxQuestions) * 100;
  const questionsRemaining = gameState.maxQuestions - gameState.questionsAsked;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-700">Game Progress</h2>
          <p className="text-slate-500">Using {gameState.selectedModel.name}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-700">
            {gameState.questionsAsked}/{gameState.maxQuestions}
          </div>
          <div className="text-sm text-slate-500">
            {questionsRemaining} questions left
          </div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-blue-500 h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-slate-500 mt-2">
        <span>Start</span>
        <span>{Math.round(progress)}% Complete</span>
        <span>Finish</span>
      </div>
    </div>
  );
}