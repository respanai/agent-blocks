// src/types/games.ts

export interface GameQuestion {
  id: string;
  question: string;
  answer: 'yes' | 'no' | 'maybe';
  timestamp: Date;
}

export interface GameState {
  id: string;
  status: 'waiting' | 'category-selection' | 'playing' | 'finished';
  currentQuestion: string | null;
  questionsAsked: number;
  maxQuestions: number;
  conversationHistory: GameQuestion[];
  finalGuess: string | null;
  confidence: number | null;
  selectedModel: AIModel;
  selectedCategory: string | null;
  startTime: Date;
  endTime: Date | null;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google';
  modelName: string;
  description: string;
}

export interface GameResponse {
  type: 'question' | 'guess';
  content: string;
  confidence?: number;
  isGameOver: boolean;
}

export interface GameRequest {
  gameId: string;
  userResponse?: 'yes' | 'no' | 'maybe';
  conversationHistory: GameQuestion[];
  selectedModel: AIModel;
  selectedCategory?: string;
  action: 'start' | 'answer' | 'reset';
}

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    modelName: 'gpt-4o-mini',
    description: 'Fast and efficient OpenAI model'
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    modelName: 'anthropic/claude-3-5-haiku-latest',
    description: 'Quick and intelligent Anthropic model'
  },
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'google',
    modelName: 'openrouter/google/gemini-2.5-flash',
    description: 'Google\'s latest fast model'
  }
];