'use client';

import { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { EmotionalState } from '@/lib/types';

interface EmotionalRadarProps {
  emotionalState?: EmotionalState;
}

export default function EmotionalRadar({ emotionalState }: EmotionalRadarProps) {
  const radarData = useMemo(() => {
    if (!emotionalState) {
      return [
        { emotion: 'Calma', value: 50 },
        { emotion: 'Enfoque', value: 50 },
        { emotion: 'Curiosidad', value: 50 },
        { emotion: 'Confianza', value: 50 },
        { emotion: 'Energía', value: 50 },
        { emotion: 'Claridad', value: 50 },
      ];
    }

    const baseIntensity = emotionalState.intensity * 100;
    const emotionMap: Record<string, number> = {
      calm: 80,
      focused: 90,
      curious: 70,
      stressed: 40,
      excited: 85,
    };

    const currentValue = emotionMap[emotionalState.current] || 50;

    return [
      { emotion: 'Calma', value: emotionalState.current === 'calm' ? currentValue : 50 },
      { emotion: 'Enfoque', value: emotionalState.current === 'focused' ? currentValue : 50 },
      { emotion: 'Curiosidad', value: emotionalState.current === 'curious' ? currentValue : 60 },
      { emotion: 'Confianza', value: baseIntensity },
      { emotion: 'Energía', value: emotionalState.current === 'excited' ? currentValue : 50 },
      { emotion: 'Claridad', value: emotionalState.current === 'stressed' ? 100 - currentValue : 70 },
    ];
  }, [emotionalState]);

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-nexus-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🎭</span>
        Radar Emocional
        {emotionalState && (
          <span className="ml-auto text-sm font-normal text-purple-400 capitalize">
            Estado: {emotionalState.current}
          </span>
        )}
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData}>
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d9ff" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#9B59B6" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          
          <PolarGrid stroke="#8B92A8" strokeWidth={1} strokeOpacity={0.3} />
          
          <PolarAngleAxis
            dataKey="emotion"
            tick={{ fill: '#F0F4F8', fontSize: 12, fontWeight: 600 }}
            stroke="#8B92A8"
            strokeOpacity={0.5}
          />
          
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#8B92A8', fontSize: 10 }}
            stroke="#8B92A8"
            strokeOpacity={0.5}
          />
          
          <Radar
            name="Intensidad"
            dataKey="value"
            stroke="#00d9ff"
            fill="url(#radarGradient)"
            fillOpacity={0.6}
            strokeWidth={3}
            dot={{
              r: 5,
              fill: '#00d9ff',
              stroke: '#fff',
              strokeWidth: 2,
            }}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>

      {emotionalState && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-nexus-dark/50 rounded-lg p-3">
            <div className="text-xs text-nexus-gray mb-1">Intensidad</div>
            <div className="text-2xl font-mono text-yellow-400">
              {(emotionalState.intensity * 100).toFixed(0)}%
            </div>
            <div className="w-full bg-nexus-darker rounded-full h-1.5 mt-2">
              <div
                className="h-1.5 rounded-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${emotionalState.intensity * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-nexus-dark/50 rounded-lg p-3">
            <div className="text-xs text-nexus-gray mb-1">Estado Regulado</div>
            <div className="text-lg text-green-400 capitalize font-semibold">
              {emotionalState.regulated}
            </div>
            <div className="text-xs text-nexus-gray mt-1">
              {emotionalState.regulated === 'calm' && '😌 Equilibrado'}
              {emotionalState.regulated === 'focused' && '🎯 Concentrado'}
              {emotionalState.regulated === 'curious' && '🤔 Explorando'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
