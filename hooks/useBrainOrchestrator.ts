import { useState } from 'react';
import { brainAPI } from '@/lib/api';
import type { BrainProcessResponse } from '@/lib/types';

export function useBrainOrchestrator() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<BrainProcessResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const processQuery = async (query: string, emotion: string = 'focused', goal: string = '') => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await brainAPI.process(query, {
        current_emotion: emotion,
        goal: goal || 'general query',
      });
      setResponse(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to process query');
      setError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processQuery,
    isProcessing,
    response,
    error,
  };
}
