// src/components/games/twenty-questions/GameInterface.tsx

"use client";
import { useState, useEffect } from 'react';
import { GameState, GameQuestion, AIModel, AVAILABLE_MODELS, GameResponse } from '@/types/games';
import { v4 as uuidv4 } from 'uuid';
import QuestionDisplay from './QuestionDisplay';
import ResponseButtons from './ResponseButtons';
import ProgressTracker from './ProgressTracker';
import GameResults from './GameResults';

interface GameInterfaceProps {
  onGameEnd?: (gameState: GameState) => void;
}

export default function GameInterface({ onGameEnd }: GameInterfaceProps) {
  const [gameState, setGameState] = useState<GameState>({
    id: uuidv4(),
    status: 'waiting',
    currentQuestion: null,
    questionsAsked: 0,
    maxQuestions: 20,
    conversationHistory: [],
    finalGuess: null,
    confidence: null,
    selectedModel: AVAILABLE_MODELS[0],
    selectedCategory: null,
    startTime: new Date(),
    endTime: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'famous-people', name: 'Famous People', description: 'celebrities, historical figures, etc.' },
    { id: 'physical-objects', name: 'Physical Objects', description: 'things you can touch' },
    { id: 'animals-nature', name: 'Animals & Nature', description: 'living creatures and natural phenomena' },
    { id: 'places-locations', name: 'Places & Locations', description: 'cities, countries, landmarks, etc.' },
    { id: 'entertainment', name: 'Movies, Books & Entertainment', description: 'films, books, shows, games, etc.' },
    { id: 'mixed', name: 'Mixed (anything goes - hardest mode!)', description: 'any category - most challenging' }
  ];

  const startNewGame = async (selectedModel: AIModel, selectedCategory: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/games/20-questions/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: uuidv4(),
          conversationHistory: [],
          selectedModel,
          selectedCategory,
          action: 'start'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start game');
      }

      const gameResponse: GameResponse = await response.json();
      
      setGameState({
        id: uuidv4(),
        status: 'playing',
        currentQuestion: gameResponse.content,
        questionsAsked: 1,
        maxQuestions: 20,
        conversationHistory: [],
        finalGuess: null,
        confidence: null,
        selectedModel,
        selectedCategory,
        startTime: new Date(),
        endTime: null
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserResponse = async (answer: 'yes' | 'no' | 'maybe') => {
    if (!gameState.currentQuestion || gameState.status !== 'playing') return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Add current question and answer to history
      const newQuestion: GameQuestion = {
        id: uuidv4(),
        question: gameState.currentQuestion,
        answer,
        timestamp: new Date()
      };

      const updatedHistory = [...gameState.conversationHistory, newQuestion];

      const response = await fetch('/api/games/20-questions/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: gameState.id,
          conversationHistory: updatedHistory,
          selectedModel: gameState.selectedModel,
          selectedCategory: gameState.selectedCategory,
          action: 'answer'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const gameResponse: GameResponse = await response.json();
      
      if (gameResponse.isGameOver || gameResponse.type === 'guess') {
        // Game is over
        const finalState: GameState = {
          ...gameState,
          status: 'finished',
          currentQuestion: null,
          conversationHistory: updatedHistory,
          finalGuess: gameResponse.content,
          confidence: gameResponse.confidence || 0,
          endTime: new Date()
        };
        
        setGameState(finalState);
        onGameEnd?.(finalState);
      } else {
        // Continue game
        setGameState({
          ...gameState,
          currentQuestion: gameResponse.content,
          questionsAsked: updatedHistory.length + 1,
          conversationHistory: updatedHistory
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process response');
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    setGameState({
      id: uuidv4(),
      status: 'waiting',
      currentQuestion: null,
      questionsAsked: 0,
      maxQuestions: 20,
      conversationHistory: [],
      finalGuess: null,
      confidence: null,
      selectedModel: AVAILABLE_MODELS[0],
      selectedCategory: null,
      startTime: new Date(),
      endTime: null
    });
    setError(null);
  };

  if (gameState.status === 'waiting') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-700 mb-4">🤔 20 Questions Game</h1>
          <p className="text-lg text-slate-600 mb-6">
            Think of something (object, person, place, concept) and I'll try to guess it in 20 questions!
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> The AI has a strong bias toward objects and animals because that's what most 20-questions training data focuses on. 
              Selecting a specific category helps the AI ask more strategic questions!
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-slate-700 mb-6 text-center">Choose Your AI Model</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {AVAILABLE_MODELS.map((model) => (
              <div
                key={model.id}
                onClick={() => setGameState({ ...gameState, selectedModel: model })}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  gameState.selectedModel.id === model.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-slate-700">{model.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{model.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setGameState({ ...gameState, status: 'category-selection' })}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
            >
              Continue to Category Selection
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-slate-700 mb-3">How to Play:</h3>
          <ul className="text-slate-600 space-y-2">
            <li>• Think of something specific (person, place, object, concept)</li>
            <li>• Answer the AI's questions with "Yes", "No", or "Maybe/Sometimes"</li>
            <li>• The AI has up to 20 questions to guess what you're thinking</li>
            <li>• Be honest with your answers for the best experience!</li>
          </ul>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    );
  }

  if (gameState.status === 'category-selection') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-700 mb-4">🎯 Choose Your Category</h1>
          <p className="text-lg text-slate-600 mb-6">
            Select what type of thing you're thinking of to help the AI ask better questions:
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => setGameState({ ...gameState, selectedCategory: category.name })}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  gameState.selectedCategory === category.name
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-slate-700 mb-1">{category.name}</h3>
                <p className="text-sm text-slate-500">{category.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setGameState({ ...gameState, status: 'waiting' })}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => gameState.selectedCategory && startNewGame(gameState.selectedModel, gameState.selectedCategory)}
              disabled={!gameState.selectedCategory || isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
            >
              {isLoading ? 'Starting Game...' : 'Start Game'}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-slate-700 mb-3">Tips for Better Gameplay:</h3>
          <ul className="text-slate-600 space-y-2">
            <li>• Choose the category that best matches what you're thinking of</li>
            <li>• "Mixed" mode is the most challenging as the AI won't have category hints</li>
            <li>• Be specific in your thinking - "Golden Retriever" vs just "Dog"</li>
            <li>• Answer honestly for the best experience!</li>
          </ul>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    );
  }

  if (gameState.status === 'finished') {
    return (
      <GameResults 
        gameState={gameState} 
        onPlayAgain={resetGame}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProgressTracker gameState={gameState} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuestionDisplay 
            question={gameState.currentQuestion}
            isLoading={isLoading}
          />
          
          <ResponseButtons 
            onResponse={handleUserResponse}
            disabled={isLoading || !gameState.currentQuestion}
          />
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-slate-700 mb-4">Conversation History</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {gameState.conversationHistory.map((qa, index) => (
                <div key={qa.id} className="text-sm">
                  <div className="font-medium text-slate-600">Q{index + 1}: {qa.question}</div>
                  <div className={`mt-1 capitalize ${
                    qa.answer === 'yes' ? 'text-green-600' :
                    qa.answer === 'no' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    A: {qa.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}