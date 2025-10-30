import useSWR from 'swr';
import { brainAPI } from '@/lib/api';
import type { HealthResponse } from '@/lib/types';

export function useHealth() {
  const { data, error, isLoading } = useSWR<HealthResponse>(
    '/health',
    () => brainAPI.health(),
    {
      refreshInterval: 5000,
      revalidateOnFocus: false,
    }
  );

  return {
    health: data,
    isLoading,
    isError: error,
    isConnected: data?.status === 'healthy',
  };
}
