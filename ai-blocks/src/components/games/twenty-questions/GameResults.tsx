// src/components/games/twenty-questions/GameResults.tsx

import { GameState } from '@/types/games';
import { useRouter } from 'next/navigation';

interface GameResultsProps {
  gameState: GameState;
  onPlayAgain: () => void;
}

export default function GameResults({ gameState, onPlayAgain }: GameResultsProps) {
  const router = useRouter();
  const gameDuration = gameState.endTime && gameState.startTime 
    ? Math.round((gameState.endTime.getTime() - gameState.startTime.getTime()) / 1000)
    : 0;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceMessage = (confidence: number) => {
    if (confidence >= 90) return '🎯 Very confident!';
    if (confidence >= 80) return '😊 Pretty confident!';
    if (confidence >= 60) return '🤔 Somewhat confident';
    return '😅 Just a guess!';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-700 mb-4">🎮 Game Complete!</h1>
      </div>

      {/* Final Guess Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🤖</span>
          </div>
          
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">My Final Guess:</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-xl text-slate-800 font-medium mb-4">
              "{gameState.finalGuess}"
            </p>
            
            {gameState.confidence && (
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getConfidenceColor(gameState.confidence)}`}>
                    {gameState.confidence}%
                  </div>
                  <div className="text-sm text-slate-500">Confidence</div>
                </div>
                <div className="text-lg">
                  {getConfidenceMessage(gameState.confidence)}
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{gameState.questionsAsked}</div>
              <div className="text-sm text-slate-500">Questions Asked</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">{gameState.maxQuestions - gameState.questionsAsked}</div>
              <div className="text-sm text-slate-500">Questions Left</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">{gameDuration}s</div>
              <div className="text-sm text-slate-500">Game Duration</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-lg font-bold text-orange-600">{gameState.selectedModel.name}</div>
              <div className="text-sm text-slate-500">AI Model</div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation History */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Conversation History</h3>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {gameState.conversationHistory.map((qa, index) => (
            <div key={qa.id} className="border-l-4 border-blue-200 pl-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-slate-700">
                    Question {index + 1}: {qa.question}
                  </div>
                  <div className={`mt-1 font-semibold capitalize ${
                    qa.answer === 'yes' ? 'text-green-600' :
                    qa.answer === 'no' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    Answer: {qa.answer}
                  </div>
                </div>
                <div className="text-xs text-slate-400 ml-4">
                  {qa.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onPlayAgain}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
        >
          🎮 Play Again
        </button>
        
        <button
          onClick={() => router.push('/')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
        >
          🏠 Back to Home
        </button>
        
        <button
          onClick={() => router.push('/sandbox')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
        >
          🛠️ Try Sandbox
        </button>
      </div>

      {/* Feedback Section */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6 text-center">
        <h4 className="font-semibold text-slate-700 mb-2">How did the AI do?</h4>
        <p className="text-slate-600 text-sm">
          This game demonstrates the reasoning capabilities of modern AI models through Keywords AI.
          Try different models to see how their questioning strategies vary!
        </p>
      </div>
    </div>
  );
}