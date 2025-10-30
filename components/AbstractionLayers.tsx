'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AbstractionLayersProps {
  activeCount: number;
}

export default function AbstractionLayers({ activeCount }: AbstractionLayersProps) {
  const layer1Ref = useRef<THREE.Mesh>(null);
  const layer2Ref = useRef<THREE.Mesh>(null);
  const layer3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const activity = activeCount / 9;

    if (layer1Ref.current) {
      layer1Ref.current.rotation.y = state.clock.elapsedTime * 0.1;
      layer1Ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime) * 0.05);
    }

    if (layer2Ref.current) {
      layer2Ref.current.rotation.y = -state.clock.elapsedTime * 0.15;
      layer2Ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      layer2Ref.current.scale.setScalar(1 + activity * 0.1);
    }

    if (layer3Ref.current) {
      layer3Ref.current.rotation.y = state.clock.elapsedTime * 0.08;
      layer3Ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group>
      {/* Capa 1: Sintaxis y Palabras */}
      <mesh ref={layer1Ref}>
        <torusGeometry args={[2.8, 0.02, 16, 100]} />
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Capa 2: Significados y Conceptos */}
      <mesh ref={layer2Ref}>
        <torusGeometry args={[3.2, 0.015, 16, 100]} />
        <meshBasicMaterial
          color="#9B59B6"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Capa 3: Contexto e Intenciones */}
      <mesh ref={layer3Ref}>
        <torusGeometry args={[3.6, 0.01, 16, 100]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Plano de referencia sutil */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <circleGeometry args={[4, 64]} />
        <meshBasicMaterial
          color="#0a0e27"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
