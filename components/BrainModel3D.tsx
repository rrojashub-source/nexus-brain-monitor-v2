'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Html, useTexture, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { LAB_COLORS, LAB_INFO } from '@/lib/types';
import type { LABInteraction } from '@/lib/types';
import HolographicShader from './HolographicShader';
import InteractiveCameraControls, { LABControlPanel } from './InteractiveCameraControls';

interface BrainModel3DProps {
  interactions?: LABInteraction[];
  activeLabIds?: string[];
  onAudioEvent?: (event: string, data?: any) => void;
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

// Sistema de partículas neuronales
function NeuralParticles({ activeLabIds }: { activeLabIds: string[] }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 500;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.5 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = new THREE.Color(0x00d9ff);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 0.5 + 0.2;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        const radius = Math.sqrt(x * x + y * y + z * z);
        const newRadius = radius + Math.sin(state.clock.elapsedTime * 2 + i) * 0.01;
        const factor = newRadius / radius;

        positions[i3] = x * factor;
        positions[i3 + 1] = y * factor;
        positions[i3 + 2] = z * factor;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[particles.sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Ondas de procesamiento
function ProcessingWave({ active }: { active: boolean }) {
  const waveRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0);

  useFrame(() => {
    if (waveRef.current && active) {
      setScale(s => {
        if (s >= 3) return 0;
        return s + 0.05;
      });
      waveRef.current.scale.setScalar(scale);
      const material = waveRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0, 1 - scale / 3);
    }
  });

  if (!active) return null;

  return (
    <mesh ref={waveRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial
        color="#00d9ff"
        transparent
        opacity={0.5}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Nodo LAB mejorado con efectos
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
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const color = LAB_COLORS[labId] || '#8B92A8';
  const info = LAB_INFO[labId];

  useFrame((state) => {
    if (meshRef.current) {
      const pulseIntensity = isActive ? 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3 : 1;
      meshRef.current.scale.setScalar(pulseIntensity);
      
      if (isActive) {
        meshRef.current.rotation.y = state.clock.elapsedTime * 2;
      }
    }

    if (glowRef.current && isActive) {
      const glowScale = 1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      glowRef.current.scale.setScalar(glowScale);
    }
  });

  return (
    <group position={position}>
      {/* Glow exterior */}
      {isActive && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Nodo principal */}
      <Sphere
        ref={meshRef}
        args={[0.15, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 2 : 0.5}
          transparent
          opacity={0.9}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>

      {/* Anillo orbital */}
      {isActive && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.02, 16, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Label con info */}
      {(hovered || isActive) && (
        <Html distanceFactor={10} position={[0, 0.4, 0]}>
          <div className="bg-nexus-darker/90 backdrop-blur-sm border border-nexus-primary/50 rounded px-3 py-2 text-xs whitespace-nowrap">
            <div className="font-mono text-nexus-primary font-bold">{labId}</div>
            <div className="text-nexus-white">{info?.name}</div>
            <div className="text-nexus-gray text-[10px]">{info?.region}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Conexiones neuronales dinámicas
function NeuralConnections({ interactions }: { interactions: LABInteraction[] }) {
  const linesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((line, i) => {
        const material = (line as THREE.Line).material as THREE.LineBasicMaterial;
        material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.3;
      });
    }
  });

  const connections = useMemo(() => {
    return interactions
      .filter(int => int.from_lab !== 'INPUT' && LAB_POSITIONS[int.from_lab] && LAB_POSITIONS[int.to_lab])
      .map(int => ({
        from: LAB_POSITIONS[int.from_lab],
        to: LAB_POSITIONS[int.to_lab],
        color: LAB_COLORS[int.from_lab] || '#00D9FF',
      }));
  }, [interactions]);

  return (
    <group ref={linesRef}>
      {connections.map((conn, idx) => (
        <Line
          key={idx}
          points={[conn.from, conn.to]}
          color={conn.color}
          lineWidth={2}
          transparent
          opacity={0.6}
          dashed={false}
        />
      ))}
    </group>
  );
}

// Cerebro principal mejorado
function EnhancedBrain({ interactions = [], activeLabIds = [], onAudioEvent }: BrainModel3DProps) {
  const brainRef = useRef<THREE.Group>(null);
  const hemisphereLeftRef = useRef<THREE.Mesh>(null);
  const hemisphereRightRef = useRef<THREE.Mesh>(null);
  const prevActiveLabsRef = useRef<string[]>([]);

  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }

    // Efecto de "respiración" en los hemisferios
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    if (hemisphereLeftRef.current) {
      hemisphereLeftRef.current.scale.setScalar(breathe);
    }
    if (hemisphereRightRef.current) {
      hemisphereRightRef.current.scale.setScalar(breathe);
    }
  });

  useEffect(() => {
    if (activeLabIds.length > prevActiveLabsRef.current.length) {
      const newLabs = activeLabIds.filter(id => !prevActiveLabsRef.current.includes(id));
      newLabs.forEach(labId => {
        const labIndex = Object.keys(LAB_POSITIONS).indexOf(labId);
        onAudioEvent?.('labActivation', labIndex);
      });
    }
    prevActiveLabsRef.current = activeLabIds;
  }, [activeLabIds, onAudioEvent]);

  return (
    <group ref={brainRef}>
      {/* Shader Holográfico */}
      <HolographicShader opacity={0.25} />

      {/* Hemisferio izquierdo */}
      <mesh ref={hemisphereLeftRef} position={[-0.3, 0, 0]}>
        <sphereGeometry args={[1.7, 64, 64, 0, Math.PI]} />
        <MeshDistortMaterial
          color="#1a1a3e"
          transparent
          opacity={0.15}
          distort={0.2}
          speed={1}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Hemisferio derecho */}
      <mesh ref={hemisphereRightRef} position={[0.3, 0, 0]} rotation={[0, Math.PI, 0]}>
        <sphereGeometry args={[1.7, 64, 64, 0, Math.PI]} />
        <MeshDistortMaterial
          color="#1a1a3e"
          transparent
          opacity={0.15}
          distort={0.2}
          speed={1}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Red neuronal wireframe */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={0.08}
          wireframe
        />
      </mesh>

      {/* Partículas neuronales */}
      <NeuralParticles activeLabIds={activeLabIds} />

      {/* Nodos LAB */}
      {Object.entries(LAB_POSITIONS).map(([labId, position]) => (
        <LABNode
          key={labId}
          labId={labId}
          position={position}
          isActive={activeLabIds.includes(labId)}
        />
      ))}

      {/* Conexiones dinámicas */}
      {interactions.length > 0 && <NeuralConnections interactions={interactions} />}

      {/* Onda de procesamiento */}
      <ProcessingWave active={activeLabIds.length > 0} />
    </group>
  );
}

// Componente principal
export default function BrainModel3D({ interactions, activeLabIds, onAudioEvent }: BrainModel3DProps) {
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | undefined>();

  const handleSelectLAB = (position: [number, number, number]) => {
    const offset = 3;
    const targetPos: [number, number, number] = [
      position[0] + offset,
      position[1] + offset,
      position[2] + offset
    ];
    setCameraTarget(targetPos);
    onAudioEvent?.('cameraZoom', position);
  };

  const handleReset = () => {
    setCameraTarget([0, 0, 6]);
    onAudioEvent?.('cameraReset');
  };

  return (
    <div className="w-full h-[600px] bg-nexus-darker border border-nexus-gray/20 rounded-lg overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        {/* Luces mejoradas */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00d9ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff3864" />
        <pointLight position={[0, 10, 0]} intensity={0.8} color="#9B59B6" />
        <spotLight
          position={[0, 5, 5]}
          angle={0.5}
          penumbra={1}
          intensity={2}
          color="#00d9ff"
        />
        
        <EnhancedBrain 
          interactions={interactions} 
          activeLabIds={activeLabIds}
          onAudioEvent={onAudioEvent}
        />
        
        <InteractiveCameraControls
          targetPosition={cameraTarget}
          autoRotate={activeLabIds && activeLabIds.length === 0}
        />

        {/* Post-processing effects */}
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            blendFunction={BlendFunction.ADD}
          />
          <ChromaticAberration
            offset={[0.001, 0.001]}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>

      {/* Overlay de estado */}
      <div className="absolute top-4 left-4 text-xs font-mono text-nexus-primary/70">
        {activeLabIds && activeLabIds.length > 0 ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>PROCESANDO... {activeLabIds.length} LABs activos</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span>MODO ESPERA</span>
          </div>
        )}
      </div>

      {/* Panel de controles */}
      <LABControlPanel 
        onSelectLAB={handleSelectLAB}
        onReset={handleReset}
      />
    </div>
  );
}
