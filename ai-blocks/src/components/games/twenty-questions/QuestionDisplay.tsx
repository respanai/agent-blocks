// src/components/games/twenty-questions/QuestionDisplay.tsx

interface QuestionDisplayProps {
  question: string | null;
  isLoading: boolean;
}

export default function QuestionDisplay({ question, isLoading }: QuestionDisplayProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🤖</span>
        </div>
        
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-slate-700 mb-4">AI Question:</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {question || 'Waiting for question...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}