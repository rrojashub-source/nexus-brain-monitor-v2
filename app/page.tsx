'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import QueryInput from '@/components/QueryInput';
import WorkingMemoryPanel from '@/components/WorkingMemoryPanel';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import OrbitalHUD from '@/components/OrbitalHUD';
import ActivityTimeline from '@/components/ActivityTimeline';
import { useBrainOrchestrator } from '@/hooks/useBrainOrchestrator';

const BrainModel3D = dynamic(() => import('@/components/BrainModel3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gradient-to-br from-nexus-darker to-nexus-dark border border-nexus-primary/20 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">🧠</div>
        <div className="text-nexus-primary font-mono">Cargando modelo 3D del cerebro...</div>
        <div className="text-nexus-gray text-sm mt-2">Inicializando sistema neuronal</div>
      </div>
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
        
        setTimeout(() => setActiveLabIds([]), 5000);
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
          <div className="bg-gradient-to-r from-red-500/10 to-red-500/5 border border-red-500/50 text-red-400 rounded-lg p-4 mb-6 backdrop-blur-sm animate-shake">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <strong className="block">Error de Conexión</strong>
                <span className="text-sm">{error.message}</span>
              </div>
            </div>
          </div>
        )}

        {/* Sección principal: Cerebro 3D + Métricas */}
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

        {/* Sección: HUD Orbital de LABs */}
        <div className="mb-6">
          <div className="bg-nexus-darker border border-nexus-gray/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-nexus-white mb-4 flex items-center gap-2">
              <span className="text-2xl">⚛️</span>
              Estado de LABs Cognitivos
              <span className="ml-auto text-sm text-nexus-gray font-normal">
                {activeLabIds.length > 0 ? `${activeLabIds.length} activos` : 'En espera'}
              </span>
            </h3>
            <OrbitalHUD activeLabIds={activeLabIds} />
          </div>
        </div>

        {/* Sección: Input y Working Memory */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <QueryInput onSubmit={handleQuerySubmit} isProcessing={isProcessing} />
          </div>

          <div>
            <WorkingMemoryPanel
              memories={response?.working_memory || []}
            />
          </div>
        </div>

        {/* Sección: Future Vision */}
        {response?.future_vision && (
          <div className="mb-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-nexus-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🔮</span>
              Visión Predictiva
            </h3>
            <p className="text-nexus-white mb-4 text-lg">{response.future_vision.scenario}</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-nexus-dark/50 rounded-lg p-3">
                <div className="text-xs text-nexus-gray mb-1">Probabilidad de Éxito</div>
                <div className="text-2xl font-mono text-green-400">
                  {(response.future_vision.success_probability * 100).toFixed(0)}%
                </div>
              </div>
              <div className="bg-nexus-dark/50 rounded-lg p-3">
                <div className="text-xs text-nexus-gray mb-1">Estado Emocional</div>
                <div className="text-lg text-nexus-primary capitalize">
                  {response.emotional_state.regulated}
                </div>
              </div>
              <div className="bg-nexus-dark/50 rounded-lg p-3">
                <div className="text-xs text-nexus-gray mb-1">Intensidad</div>
                <div className="text-2xl font-mono text-yellow-400">
                  {(response.emotional_state.intensity * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sección: Timeline de Actividad */}
        <ActivityTimeline currentResponse={response || undefined} />
      </main>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
