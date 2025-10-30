'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { LAB_COLORS, LAB_INFO } from '@/lib/types';
import type { LABInteraction } from '@/lib/types';

interface BrainModel3DProps {
  interactions?: LABInteraction[];
  activeLabIds?: string[];
}

const LAB_POSITIONS: Record<string, [number, number, number]> = {
  'LAB_001': [-1.5, -0.5, 1],
  'LAB_006': [1, 1.5, 0.5],
  'LAB_007': [1.5, 1, -0.5],
  'LAB_008': [-1, -1, 0],
  'LAB_009': [0, -1.5, 0.5],
  'LAB_010': [0, 1.5, -1],
  'LAB_011': [-1.5, 0, -0.5],
  'LAB_012': [1.5, 0.5, 1],
  'LAB_028': [0.5, -0.5, 1.5],
};

function LABNode({ 
  labId, 
  position, 
  isActive 
}: { 
  labId: string; 
  position: [number, number, number]; 
  isActive: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = LAB_COLORS[labId] || '#8B92A8';

  useFrame((state) => {
    if (meshRef.current && isActive) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      meshRef.current.scale.setScalar(scale);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.15, 16, 16]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 1.5 : 0.3}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {isActive && (
        <Sphere args={[0.2, 16, 16]}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
    </group>
  );
}

function InteractionLines({ interactions }: { interactions: LABInteraction[] }) {
  const lines = useMemo(() => {
    return interactions
      .filter(int => int.from_lab !== 'INPUT' && LAB_POSITIONS[int.from_lab] && LAB_POSITIONS[int.to_lab])
      .map(int => ({
        from: LAB_POSITIONS[int.from_lab],
        to: LAB_POSITIONS[int.to_lab],
        color: LAB_COLORS[int.from_lab] || '#00D9FF',
      }));
  }, [interactions]);

  return (
    <>
      {lines.map((line, idx) => (
        <Line
          key={idx}
          points={[line.from, line.to]}
          color={line.color}
          lineWidth={2}
          transparent
          opacity={0.6}
        />
      ))}
    </>
  );
}

function Brain({ interactions = [], activeLabIds = [] }: BrainModel3DProps) {
  const brainRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.3;
    }
  });

  return (
    <group ref={brainRef}>
      <Sphere args={[2, 32, 32]}>
        <meshStandardMaterial
          color="#1a1a2e"
          transparent
          opacity={0.1}
          wireframe
        />
      </Sphere>

      {Object.entries(LAB_POSITIONS).map(([labId, position]) => (
        <LABNode
          key={labId}
          labId={labId}
          position={position}
          isActive={activeLabIds.includes(labId)}
        />
      ))}

      {interactions.length > 0 && <InteractionLines interactions={interactions} />}
    </group>
  );
}

export default function BrainModel3D({ interactions, activeLabIds }: BrainModel3DProps) {
  return (
    <div className="w-full h-[600px] bg-nexus-darker border border-nexus-gray/20 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00D9FF" />
        
        <Brain interactions={interactions} activeLabIds={activeLabIds} />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}
