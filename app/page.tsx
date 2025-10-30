'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import QueryInput from '@/components/QueryInput';
import WorkingMemoryPanel from '@/components/WorkingMemoryPanel';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import LABStatusGrid from '@/components/LABStatusGrid';
import { useBrainOrchestrator } from '@/hooks/useBrainOrchestrator';
import type { BrainProcessResponse } from '@/lib/types';

const BrainModel3D = dynamic(() => import('@/components/BrainModel3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-nexus-darker border border-nexus-gray/20 rounded-lg flex items-center justify-center">
      <div className="text-nexus-gray">Loading 3D Brain Model...</div>
    </div>
  ),
});

export default function Home() {
  const { processQuery, isProcessing, response, error } = useBrainOrchestrator();
  const [activeLabIds, setActiveLabIds] = useState<string[]>([]);

  const handleQuerySubmit = async (query: string, emotion: string, goal: string) => {
    try {
      const result = await processQuery(query, emotion, goal);
      
      if (result.interactions) {
        const labIds = result.interactions.map(int => int.to_lab);
        setActiveLabIds(Array.from(new Set(labIds)));
        
        setTimeout(() => setActiveLabIds([]), 3000);
      }
    } catch (err) {
      console.error('Failed to process query:', err);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-dark">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-4 mb-6">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <BrainModel3D
              interactions={response?.interactions}
              activeLabIds={activeLabIds}
            />
          </div>

          <div>
            <PerformanceMetrics
              processingTime={response?.processing_time_ms}
              activeLabs={activeLabIds.length}
              totalLabs={9}
              confidence={response?.metacognition.confidence}
              totalEpisodes={response?.working_memory.length || 0}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <LABStatusGrid activeLabIds={activeLabIds} />
          </div>

          <div>
            <WorkingMemoryPanel
              memories={response?.working_memory || []}
            />
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <QueryInput onSubmit={handleQuerySubmit} isProcessing={isProcessing} />
        </div>

        {response?.future_vision && (
          <div className="mt-6 bg-nexus-darker border border-nexus-gray/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-nexus-white mb-4">
              Future Vision
            </h3>
            <p className="text-nexus-white mb-2">{response.future_vision.scenario}</p>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-nexus-gray">Success Probability: </span>
                <span className="text-nexus-primary font-mono">
                  {(response.future_vision.success_probability * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <span className="text-nexus-gray">Emotional State: </span>
                <span className="text-nexus-primary">
                  {response.emotional_state.regulated}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
