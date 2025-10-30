'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ConceptualNebulaProps {
  position: [number, number, number];
  color: string;
  intensity: number;
}

export default function ConceptualNebula({ position, color, intensity }: ConceptualNebulaProps) {
  const cloudRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 200;
  const particles = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const radius = Math.random() * 0.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    particles[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    particles[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particles[i * 3 + 2] = radius * Math.cos(phi);

    const colorObj = new THREE.Color(color);
    colors[i * 3] = colorObj.r;
    colors[i * 3 + 1] = colorObj.g;
    colors[i * 3 + 2] = colorObj.b;
  }

  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      cloudRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
      
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2 * intensity;
      cloudRef.current.scale.setScalar(scale);
    }

    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const angle = state.clock.elapsedTime + i * 0.1;
        positions[i3] += Math.sin(angle) * 0.001;
        positions[i3 + 1] += Math.cos(angle) * 0.001;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position} ref={cloudRef}>
      {/* Nebulosa externa */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Capa media */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Núcleo brillante */}
      <mesh>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Partículas flotantes */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.6 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
