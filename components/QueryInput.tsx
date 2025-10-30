'use client';

import { useState } from 'react';

interface QueryInputProps {
  onSubmit: (query: string, emotion: string, goal: string) => void;
  isProcessing: boolean;
}

const EMOTIONS = ['focused', 'curious', 'stressed', 'calm'];

export default function QueryInput({ onSubmit, isProcessing }: QueryInputProps) {
  const [query, setQuery] = useState('');
  const [emotion, setEmotion] = useState('focused');
  const [goal, setGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query, emotion, goal);
    }
  };

  return (
    <div className="bg-nexus-darker border border-nexus-gray/20 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-nexus-white mb-4">
        Process Query
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-nexus-gray mb-2">
            Query
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter episodic memory query..."
            className="w-full bg-nexus-dark border border-nexus-gray/30 rounded px-4 py-2 text-nexus-white placeholder-nexus-gray/50 focus:outline-none focus:border-nexus-primary"
            disabled={isProcessing}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-nexus-gray mb-2">
              Emotional Context
            </label>
            <select
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              className="w-full bg-nexus-dark border border-nexus-gray/30 rounded px-4 py-2 text-nexus-white focus:outline-none focus:border-nexus-primary"
              disabled={isProcessing}
            >
              {EMOTIONS.map((e) => (
                <option key={e} value={e}>
                  {e.charAt(0).toUpperCase() + e.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-nexus-gray mb-2">
              Goal (optional)
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., understand debugging"
              className="w-full bg-nexus-dark border border-nexus-gray/30 rounded px-4 py-2 text-nexus-white placeholder-nexus-gray/50 focus:outline-none focus:border-nexus-primary"
              disabled={isProcessing}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing || !query.trim()}
          className="w-full bg-nexus-primary hover:bg-nexus-primary/80 disabled:bg-nexus-gray/30 disabled:cursor-not-allowed text-nexus-dark font-semibold py-3 rounded transition-colors"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-nexus-dark/30 border-t-nexus-dark rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            'Process Query'
          )}
        </button>
      </form>
    </div>
  );
}
