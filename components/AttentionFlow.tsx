'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AttentionFlowProps {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  active: boolean;
}

export default function AttentionFlow({ from, to, color, active }: AttentionFlowProps) {
  const lineRef = useRef<THREE.Line>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(...from),
    new THREE.Vector3(
      (from[0] + to[0]) / 2,
      (from[1] + to[1]) / 2 + 0.5,
      (from[2] + to[2]) / 2
    ),
    new THREE.Vector3(...to),
  ]);

  const points = curve.getPoints(50);
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  // Partículas fluyendo
  const flowParticleCount = 20;
  const flowPositions = new Float32Array(flowParticleCount * 3);
  const flowColors = new Float32Array(flowParticleCount * 3);
  const colorObj = new THREE.Color(color);

  for (let i = 0; i < flowParticleCount; i++) {
    const t = i / flowParticleCount;
    const point = curve.getPoint(t);
    flowPositions[i * 3] = point.x;
    flowPositions[i * 3 + 1] = point.y;
    flowPositions[i * 3 + 2] = point.z;

    flowColors[i * 3] = colorObj.r;
    flowColors[i * 3 + 1] = colorObj.g;
    flowColors[i * 3 + 2] = colorObj.b;
  }

  useFrame((state) => {
    if (lineRef.current && active) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }

    if (particlesRef.current && active) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < flowParticleCount; i++) {
        const t = ((state.clock.elapsedTime * 0.2 + i / flowParticleCount) % 1);
        const point = curve.getPoint(t);
        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!active) return null;

  return (
    <group>
      {/* Línea de flujo */}
      <line ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          linewidth={2}
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Partículas fluyendo */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[flowPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[flowColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Glow en los extremos */}
      <mesh position={from}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh position={to}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
