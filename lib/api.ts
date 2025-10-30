import axios from 'axios';
import type { BrainProcessResponse, HealthResponse, StatsResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const brainAPI = {
  health: async (): Promise<HealthResponse> => {
    const response = await api.get('/health');
    return response.data;
  },
  
  process: async (query: string, context: any): Promise<BrainProcessResponse> => {
    const response = await api.post('/brain/process', { query, context });
    return response.data;
  },
  
  stats: async (): Promise<StatsResponse> => {
    const response = await api.get('/stats');
    return response.data;
  },
};
