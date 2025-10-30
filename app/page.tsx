'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import QueryInput from '@/components/QueryInput';
import WorkingMemoryPanel from '@/components/WorkingMemoryPanel';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import OrbitalHUD from '@/components/OrbitalHUD';
import ActivityTimeline from '@/components/ActivityTimeline';
import EmotionalRadar from '@/components/EmotionalRadar';
import { LABControlPanel } from '@/components/BrainModel3D';
import { useBrainOrchestrator } from '@/hooks/useBrainOrchestrator';
import { useAudioSystem } from '@/hooks/useAudioSystem';

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
  const [audioEnabled, setAudioEnabled] = useState(true);

  const {
    playNeuralPulse,
    playProcessingStart,
    playLABActivation,
    playConnectionSound,
    playAmbientHum,
  } = useAudioSystem({ enabled: audioEnabled, volume: 0.3 });

  const handleAudioEvent = useCallback((event: string, data?: any) => {
    if (!audioEnabled) return;

    switch (event) {
      case 'labActivation':
        playLABActivation(data);
        break;
      case 'cameraZoom':
        playNeuralPulse(600, 0.2);
        break;
      case 'cameraReset':
        playNeuralPulse(400, 0.15);
        break;
      case 'connection':
        playConnectionSound();
        break;
      default:
        break;
    }
  }, [audioEnabled, playLABActivation, playNeuralPulse, playConnectionSound]);

  const handleQuerySubmit = async (query: string, emotion: string, goal: string) => {
    try {
      if (audioEnabled) {
        playProcessingStart();
        setTimeout(() => playAmbientHum(), 200);
      }

      const result = await processQuery(query, emotion, goal);
      
      if (result.interactions) {
        const labIds = result.interactions.map(int => int.to_lab);
        setActiveLabIds(Array.from(new Set(labIds)));
        
        if (audioEnabled) {
          playConnectionSound();
        }
        
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
        {/* Control de audio */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              audioEnabled
                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                : 'bg-red-500/20 border-red-500/50 text-red-400'
            }`}
          >
            {audioEnabled ? '🔊 Audio ON' : '🔇 Audio OFF'}
          </button>
        </div>

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

        {/* Sección principal: Cerebro 3D + Métricas + Controles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <BrainModel3D
              interactions={response?.interactions}
              activeLabIds={activeLabIds}
              onAudioEvent={handleAudioEvent}
            />
          </div>

          <div className="space-y-6">
            <PerformanceMetrics
              processingTime={response?.processing_time_ms}
              activeLabs={activeLabIds.length}
              totalLabs={9}
              confidence={response?.metacognition.confidence}
              totalEpisodes={response?.working_memory.length || 0}
            />

            <LABControlPanel 
              onSelectLAB={(position) => {
                if ((window as any).__brainSelectLAB) {
                  (window as any).__brainSelectLAB(position);
                }
              }}
              onReset={() => {
                if ((window as any).__brainResetCamera) {
                  (window as any).__brainResetCamera();
                }
              }}
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

        {/* Sección: Input, Working Memory y Radar Emocional */}
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

        {/* Sección: Radar Emocional */}
        {response?.emotional_state && (
          <div className="mb-6">
            <EmotionalRadar emotionalState={response.emotional_state} />
          </div>
        )}

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
