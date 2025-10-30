'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { BrainProcessResponse } from '@/lib/types';

interface ActivityTimelineProps {
  currentResponse?: BrainProcessResponse;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  query: string;
  processingTime: number;
  memoriesCount: number;
  confidence: number;
  emotion: string;
}

export default function ActivityTimeline({ currentResponse }: ActivityTimelineProps) {
  const [history, setHistory] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    if (currentResponse) {
      const newEvent: TimelineEvent = {
        id: currentResponse.timestamp,
        timestamp: currentResponse.timestamp,
        query: currentResponse.working_memory[0]?.content?.slice(0, 50) || 'Query procesada',
        processingTime: currentResponse.processing_time_ms,
        memoriesCount: currentResponse.working_memory.length,
        confidence: currentResponse.metacognition.confidence,
        emotion: currentResponse.emotional_state.current,
      };

      setHistory(prev => [newEvent, ...prev.slice(0, 9)]);
    }
  }, [currentResponse]);

  if (history.length === 0) {
    return (
      <div className="bg-nexus-darker border border-nexus-gray/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-nexus-white mb-4 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Timeline de Actividad
        </h3>
        <div className="text-center py-12 text-nexus-gray">
          <p>No hay actividad reciente</p>
          <p className="text-sm mt-2">Procesa una query para ver el historial</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-nexus-darker border border-nexus-gray/20 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-nexus-white mb-4 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        Timeline de Actividad
        <span className="ml-auto text-sm text-nexus-gray font-normal">
          Últimas {history.length} queries
        </span>
      </h3>

      <div className="relative">
        {/* Línea de tiempo vertical */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-nexus-primary via-nexus-primary/50 to-transparent" />

        <div className="space-y-4">
          {history.map((event, index) => (
            <div
              key={event.id}
              className="relative pl-12 group"
              style={{
                animation: index === 0 ? 'slideIn 0.5s ease-out' : undefined,
              }}
            >
              {/* Punto en la línea de tiempo */}
              <div
                className={`absolute left-2.5 w-3 h-3 rounded-full ${
                  index === 0
                    ? 'bg-nexus-primary animate-pulse shadow-lg shadow-nexus-primary/50'
                    : 'bg-nexus-gray/50'
                }`}
              />

              {/* Card del evento */}
              <div className="bg-nexus-dark/50 border border-nexus-gray/20 rounded-lg p-4 hover:border-nexus-primary/50 transition-all hover:shadow-lg hover:shadow-nexus-primary/10">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-sm text-nexus-white font-medium mb-1 line-clamp-1">
                      {event.query}...
                    </div>
                    <div className="text-xs text-nexus-gray">
                      {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                    </div>
                  </div>

                  {/* Emoji de emoción */}
                  <div className="text-2xl ml-2">
                    {event.emotion === 'focused' && '🎯'}
                    {event.emotion === 'curious' && '🤔'}
                    {event.emotion === 'stressed' && '😰'}
                    {event.emotion === 'calm' && '😌'}
                  </div>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="bg-nexus-darker/50 rounded px-2 py-1">
                    <div className="text-xs text-nexus-gray">Tiempo</div>
                    <div className={`text-sm font-mono font-semibold ${
                      event.processingTime < 50 ? 'text-green-400' :
                      event.processingTime < 100 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {event.processingTime.toFixed(1)}ms
                    </div>
                  </div>

                  <div className="bg-nexus-darker/50 rounded px-2 py-1">
                    <div className="text-xs text-nexus-gray">Memorias</div>
                    <div className="text-sm font-mono font-semibold text-nexus-primary">
                      {event.memoriesCount}
                    </div>
                  </div>

                  <div className="bg-nexus-darker/50 rounded px-2 py-1">
                    <div className="text-xs text-nexus-gray">Confianza</div>
                    <div className="text-sm font-mono font-semibold text-nexus-white">
                      {(event.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
