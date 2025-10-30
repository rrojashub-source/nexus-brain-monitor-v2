export interface LABInteraction {
  from_lab: string;
  to_lab: string;
  signal: string;
  timestamp: string;
}

export interface WorkingMemoryItem {
  episode_id: string;
  attention: number;
  content: string;
  salience: number;
  created_at: string;
}

export interface BrainProcessResponse {
  success: boolean;
  working_memory: WorkingMemoryItem[];
  predictions: string[];
  future_vision: {
    scenario: string;
    success_probability: number;
    based_on_episodes: string[];
    time_horizon: string;
  };
  emotional_state: {
    current: string;
    regulated: string;
    intensity: number;
  };
  interactions: LABInteraction[];
  metacognition: {
    confidence: number;
    reasoning: string;
    calibration_score: number;
  };
  processing_time_ms: number;
  timestamp: string;
}

export interface LABStatus {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  last_processed?: string;
  total_invocations?: number;
}

export interface HealthResponse {
  status: string;
  version: string;
  agent_id: string;
  database: string;
  redis: string;
  queue_depth: number;
  timestamp: string;
}

export interface StatsResponse {
  total_episodes: number;
  total_queries: number;
  avg_processing_time_ms: number;
  active_labs: number;
  labs: LABStatus[];
}

export const LAB_COLORS: Record<string, string> = {
  'LAB_001': '#FF3864',
  'LAB_006': '#9B59B6',
  'LAB_007': '#3498DB',
  'LAB_008': '#E67E22',
  'LAB_009': '#2ECC71',
  'LAB_010': '#F1C40F',
  'LAB_011': '#00D9FF',
  'LAB_012': '#FF6B9D',
  'LAB_028': '#C471ED',
};

export const LAB_INFO: Record<string, { name: string; region: string }> = {
  'LAB_001': { name: 'Emotional Salience', region: 'Amygdala' },
  'LAB_006': { name: 'Metacognition', region: 'Lateral PFC' },
  'LAB_007': { name: 'Predictive Preloading', region: 'Dorsolateral PFC' },
  'LAB_008': { name: 'Emotional Contagion', region: 'Limbic system' },
  'LAB_009': { name: 'Memory Reconsolidation', region: 'Hippocampus' },
  'LAB_010': { name: 'Attention Mechanism', region: 'Parietal cortex' },
  'LAB_011': { name: 'Working Memory', region: 'Temporal lobe' },
  'LAB_012': { name: 'Future Thinking', region: 'Frontal lobe' },
  'LAB_028': { name: 'Emotional Intelligence', region: 'Orbitofrontal cortex' },
};
