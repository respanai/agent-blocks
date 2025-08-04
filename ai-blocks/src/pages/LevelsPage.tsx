"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/components/navigation/TopNavBar';

interface LevelCard {
  id: string;
  title: string;
  description: string;
  path: string;
  status: 'available' | 'coming-soon';
  icon: string;
  difficulty: string;
  estimatedDuration?: string;
}

const LEVELS: LevelCard[] = [
  {
    id: 'level-1',
    title: 'Tutorial 1 - Calendar Agent',
    description: 'Learn to build an AI agent that schedules meetings and manages calendar conflicts using block-based workflows.',
    path: '/level1',
    status: 'available',
    icon: '📅',
    difficulty: 'Beginner',
    estimatedDuration: '5-10 min'
  }
];

const COMING_SOON_LEVELS: LevelCard[] = [
  {
    id: 'level-2',
    title: 'Tutorial 2 - Multi-Agent System',
    description: 'Design competing AI agents with complex decision trees and state management.',
    path: '/level2',
    status: 'coming-soon',
    icon: '🤖',
    difficulty: 'Intermediate',
    estimatedDuration: '15-20 min'
  },
  {
    id: 'level-3',
    title: 'Tutorial 3 - Advanced Workflows',
    description: 'Build sophisticated AI workflows with conditional logic and error handling.',
    path: '/level3',
    status: 'coming-soon',
    icon: '⚡',
    difficulty: 'Advanced',
    estimatedDuration: '20-30 min'
  }
];

export default function LevelsPage() {
  const router = useRouter();

  const handleLevelClick = (level: LevelCard) => {
    if (level.status === 'available') {
      router.push(level.path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavBar />
      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            Agent Blocks Tutorials
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Learn to build AI agents through interactive block-based tutorials. Start with the basics and progress to advanced workflows.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-slate-700 mb-8 text-center">
            Available Tutorials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LEVELS.map((level) => (
              <div
                key={level.id}
                onClick={() => handleLevelClick(level)}
                className="bg-white border border-gray-200 p-8 rounded-xl cursor-pointer transform hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-lg hover:border-gray-300"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{level.icon}</div>
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">
                    {level.title}
                  </h3>
                  <div className="flex justify-center items-center gap-4 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {level.difficulty}
                    </span>
                    {level.estimatedDuration && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {level.estimatedDuration}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {level.description}
                  </p>
                  <div className="bg-slate-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors inline-block">
                    Start Tutorial
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-slate-700 mb-8 text-center">
            Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COMING_SOON_LEVELS.map((level) => (
              <div
                key={level.id}
                className="bg-gray-200 border-2 border-dashed border-gray-400 p-8 rounded-xl opacity-60"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4 opacity-50">{level.icon}</div>
                  <h3 className="text-2xl font-bold mb-2 text-slate-500">
                    {level.title}
                  </h3>
                  <div className="flex justify-center items-center gap-4 mb-4">
                    <span className="bg-gray-300 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                      {level.difficulty}
                    </span>
                    {level.estimatedDuration && (
                      <span className="bg-gray-300 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                        {level.estimatedDuration}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 mb-6 leading-relaxed">
                    {level.description}
                  </p>
                  <div className="bg-slate-400 text-white px-6 py-3 rounded-lg font-medium inline-block">
                    Coming Soon
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <button
            onClick={() => router.push('/games')}
            className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            ← Back to Games
          </button>
        </div>
      </div>
    </div>
  );
}