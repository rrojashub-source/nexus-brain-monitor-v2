'use client';

import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface InteractiveCameraControlsProps {
  targetPosition?: [number, number, number];
  onZoomComplete?: () => void;
  autoRotate?: boolean;
}

export default function InteractiveCameraControls({
  targetPosition,
  onZoomComplete,
  autoRotate = true,
}: InteractiveCameraControlsProps) {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const [isAnimating, setIsAnimating] = useState(false);

  useFrame(() => {
    if (targetPosition && !isAnimating && controlsRef.current) {
      setIsAnimating(true);
      
      const startPosition = new THREE.Vector3().copy(camera.position);
      const endPosition = new THREE.Vector3(...targetPosition);
      const startTime = Date.now();
      const duration = 1500;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        camera.position.lerpVectors(startPosition, endPosition, eased);
        controlsRef.current?.target.lerp(new THREE.Vector3(0, 0, 0), eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          onZoomComplete?.();
        }
      };

      animate();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={3}
      maxDistance={10}
      autoRotate={autoRotate && !isAnimating}
      autoRotateSpeed={0.5}
      enableDamping
      dampingFactor={0.05}
    />
  );
}

interface LABControlPanelProps {
  onSelectLAB: (position: [number, number, number]) => void;
  onReset: () => void;
}

export function LABControlPanel({ onSelectLAB, onReset }: LABControlPanelProps) {
  const labs = [
    { id: 'LAB_001', name: 'Amígdala', position: [-1.5, -0.5, 1] as [number, number, number] },
    { id: 'LAB_006', name: 'Lateral PFC', position: [1, 1.5, 0.5] as [number, number, number] },
    { id: 'LAB_007', name: 'Dorsolateral PFC', position: [1.5, 1, -0.5] as [number, number, number] },
    { id: 'LAB_008', name: 'Sistema Límbico', position: [-1, -1, 0] as [number, number, number] },
    { id: 'LAB_009', name: 'Hipocampo', position: [0, -1.5, 0.5] as [number, number, number] },
  ];

  return (
    <div className="absolute top-4 right-4 bg-nexus-darker/90 backdrop-blur-sm border border-nexus-primary/30 rounded-lg p-4 max-w-xs">
      <h4 className="text-sm font-semibold text-nexus-white mb-3 flex items-center gap-2">
        🎮 Controles de Cámara
      </h4>

      <div className="space-y-2 mb-3">
        {labs.map((lab) => (
          <button
            key={lab.id}
            onClick={() => onSelectLAB(lab.position)}
            className="w-full text-left px-3 py-2 bg-nexus-dark hover:bg-nexus-primary/20 border border-nexus-gray/20 hover:border-nexus-primary/50 rounded text-xs text-nexus-white transition-all"
          >
            <span className="font-mono text-nexus-primary">{lab.id}</span>
            <span className="text-nexus-gray ml-2">{lab.name}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onReset}
        className="w-full px-3 py-2 bg-gradient-to-r from-nexus-primary to-purple-500 text-white font-semibold rounded text-sm hover:shadow-lg hover:shadow-nexus-primary/50 transition-all"
      >
        🔄 Vista General
      </button>
    </div>
  );
}
