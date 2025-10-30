# NEXUS Brain Monitor v2.0

## Project Overview

Brain Monitor v2.0 is a Next.js application that provides real-time 3D visualization of the NEXUS Brain Orchestrator v1.1 cognitive processing system. It displays interactive 3D brain models with LAB nodes, real-time processing metrics, and episodic memory retrieval.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **3D Graphics**: Three.js with React Three Fiber
- **Styling**: Tailwind CSS 4
- **Data Fetching**: SWR for real-time updates, Axios for API calls
- **Charts**: Recharts

## Project Structure

```
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles with Tailwind theme
├── components/
│   ├── Header.tsx            # Connection status and version info
│   ├── BrainModel3D.tsx      # Three.js 3D brain visualization
│   ├── LABStatusGrid.tsx     # Grid of active LAB nodes
│   ├── QueryInput.tsx        # Query form for brain processing
│   ├── WorkingMemoryPanel.tsx # Display retrieved memories
│   └── PerformanceMetrics.tsx # Processing time and stats
├── hooks/
│   ├── useHealth.ts          # Health check hook
│   └── useBrainOrchestrator.ts # Brain processing hook
├── lib/
│   ├── api.ts                # API client configuration
│   └── types.ts              # TypeScript interfaces
└── package.json              # Dependencies and scripts
```

## Architecture

The application connects to the Brain Orchestrator v1.1 backend API (expected on port 8003) to:
- Monitor health and connection status
- Process episodic memory queries through 9 active LAB nodes
- Display real-time LAB interactions and working memory
- Show performance metrics and emotional state

### Active LABs (9/50)

- LAB_001: Emotional Salience (Amygdala)
- LAB_006: Metacognition (Lateral PFC)
- LAB_007: Predictive Preloading (Dorsolateral PFC)
- LAB_008: Emotional Contagion (Limbic system)
- LAB_009: Memory Reconsolidation (Hippocampus)
- LAB_010: Attention Mechanism (Parietal cortex)
- LAB_011: Working Memory (Temporal lobe)
- LAB_012: Future Thinking (Frontal lobe)
- LAB_028: Emotional Intelligence (Orbitofrontal cortex)

## Development Setup

### Environment Variables

The application requires the Brain Orchestrator API URL:

```
NEXT_PUBLIC_API_URL=http://localhost:8003
```

This is configured in `.env.local` (not committed to git).

### Running Locally

```bash
npm install
npm run dev
```

The app runs on port 5000 (http://0.0.0.0:5000).

### Building for Production

```bash
npm run build
npm run start
```

## Key Features

1. **3D Brain Visualization**: Interactive brain model with anatomically positioned LAB nodes
2. **Real-time Processing**: LAB nodes light up and pulse during query processing
3. **Working Memory Display**: Shows retrieved episodic memories with attention/salience scores
4. **Performance Metrics**: Processing time, active LABs, confidence levels
5. **LAB Status Grid**: 3x3 grid showing status of all active LABs
6. **Query Interface**: Submit queries with emotional context

## API Integration

The app consumes these Brain Orchestrator endpoints:

- `GET /health` - Connection and health status
- `POST /brain/process` - Process episodic memory queries
- `GET /stats` - System statistics (if available)

## Design System

### Color Palette

- Background: #0A0E27 (nexus-dark)
- Panels: #060918 (nexus-darker)
- Primary: #00D9FF (cyan accent)
- Secondary: #FF3864 (error/warning)
- Text Gray: #8B92A8
- Text White: #F0F4F8

### LAB Colors

Each LAB has a distinct color for visual identification in the 3D model and status grid.

## Recent Changes

- **2025-10-30**: Initial implementation
  - Created Next.js 16 project with Tailwind CSS 4
  - Implemented all core components
  - Added 3D brain visualization with Three.js
  - Configured for Replit environment (port 5000, host 0.0.0.0)
  - Set up deployment configuration

## Known Limitations

1. **Backend Dependency**: Requires Brain Orchestrator v1.1 running on port 8003
2. **WebGL Support**: 3D visualization requires WebGL (may not work in all environments)
3. **No WebSocket**: Uses polling (SWR) instead of WebSocket for real-time updates
4. **Limited Historical Data**: No persistent query history (stored in React state only)

## User Preferences

None documented yet.

## Future Enhancements

- Emotional radar chart visualization
- Somatic state bars
- Episode timeline with history
- LAB details modal on node click
- WebSocket support for true real-time updates
- Export functionality (JSON/CSV)
- Mobile optimization
