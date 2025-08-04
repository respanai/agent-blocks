import React from 'react';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/components/navigation/TopNavBar';

interface GameCard {
  id: string;
  title: string;
  description: string;
  path: string;
  status: 'available' | 'coming-soon';
  icon: string;
}

const GAMES: GameCard[] = [
  {
    id: '20-questions',
    title: '20 Questions',
    description: 'Test your deduction skills against AI in this classic guessing game.',
    path: '/games/20-questions',
    status: 'available',
    icon: '🤔'
  },
  {
    id: 'agent-blocks',
    title: 'Agent Blocks',
    description: 'Learn to build AI agents through interactive block-based tutorials.',
    path: '/levels',
    status: 'available',
    icon: '🧩'
  }
];

const COMING_SOON_GAMES: GameCard[] = [
  {
    id: 'word-chain',
    title: 'Word Chain',
    description: 'Create word chains with AI in this creative language game.',
    path: '/games/word-chain',
    status: 'coming-soon',
    icon: '🔗'
  },
  {
    id: 'story-builder',
    title: 'Story Builder',
    description: 'Collaborate with AI to create engaging stories.',
    path: '/games/story-builder',
    status: 'coming-soon',
    icon: '📚'
  }
];

export default function GamesPage() {
  const router = useRouter();

  const handleGameClick = (game: GameCard) => {
    if (game.status === 'available') {
      router.push(game.path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavBar />
      <div className="container mx-auto px-4 py-12 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            AI Games
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Challenge yourself with interactive AI-powered games and learn through play.
          </p>
        </div>

        {/* Available Games */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-slate-700 mb-8 text-center">
            Available Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GAMES.map((game) => (
              <div
                key={game.id}
                onClick={() => handleGameClick(game)}
                className="bg-white border border-gray-200 p-8 rounded-xl cursor-pointer transform hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-lg hover:border-gray-300"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{game.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">
                    {game.title}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {game.description}
                  </p>
                  <div className="bg-slate-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors inline-block">
                    Play Now
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Games */}
        <div>
          <h2 className="text-3xl font-semibold text-slate-700 mb-8 text-center">
            Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COMING_SOON_GAMES.map((game) => (
              <div
                key={game.id}
                className="bg-gray-200 border-2 border-dashed border-gray-400 p-8 rounded-xl opacity-60"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4 opacity-50">{game.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-500">
                    {game.title}
                  </h3>
                  <p className="text-slate-500 mb-6 leading-relaxed">
                    {game.description}
                  </p>
                  <div className="bg-slate-400 text-white px-6 py-3 rounded-lg font-medium inline-block">
                    Coming Soon
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-16">
          <button
            onClick={() => router.push('/')}
            className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}