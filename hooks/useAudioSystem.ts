'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioSystemOptions {
  enabled?: boolean;
  volume?: number;
}

export function useAudioSystem({ enabled = true, volume = 0.3 }: AudioSystemOptions = {}) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (enabled && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass && !audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
        setIsInitialized(true);
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [enabled]);

  const playNeuralPulse = (frequency: number = 440, duration: number = 0.1) => {
    if (!audioContextRef.current || !enabled) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.Q.setValueAtTime(10, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  const playProcessingStart = () => {
    if (!audioContextRef.current || !enabled) return;

    const ctx = audioContextRef.current;
    const frequencies = [220, 330, 440, 550, 660];

    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        playNeuralPulse(freq, 0.15);
      }, i * 50);
    });
  };

  const playLABActivation = (labIndex: number) => {
    const baseFreq = 200 + labIndex * 50;
    playNeuralPulse(baseFreq, 0.2);
  };

  const playConnectionSound = () => {
    if (!audioContextRef.current || !enabled) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  };

  const playAmbientHum = () => {
    if (!audioContextRef.current || !enabled) return;

    const ctx = audioContextRef.current;
    const oscillator1 = ctx.createOscillator();
    const oscillator2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(ctx.destination);

    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);

    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(60, ctx.currentTime);
    
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(90, ctx.currentTime);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.5, ctx.currentTime);
    lfoGain.gain.setValueAtTime(volume * 0.05, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume * 0.1, ctx.currentTime);

    oscillator1.start(ctx.currentTime);
    oscillator2.start(ctx.currentTime);
    lfo.start(ctx.currentTime);

    setTimeout(() => {
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
      oscillator1.stop(ctx.currentTime + 1);
      oscillator2.stop(ctx.currentTime + 1);
      lfo.stop(ctx.currentTime + 1);
    }, 2000);
  };

  return {
    isInitialized,
    playNeuralPulse,
    playProcessingStart,
    playLABActivation,
    playConnectionSound,
    playAmbientHum,
  };
}
