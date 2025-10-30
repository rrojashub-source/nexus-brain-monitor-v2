'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ThoughtPulseProps {
  active: boolean;
}

export default function ThoughtPulse({ active }: ThoughtPulseProps) {
  const [pulses, setPulses] = useState<{ id: number; scale: number; opacity: number }[]>([]);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (active) {
      const newPulse = {
        id: Date.now(),
        scale: 0,
        opacity: 1,
      };
      setPulses((prev) => [...prev, newPulse]);
    }
  }, [active]);

  useFrame((state, delta) => {
    setPulses((prev) =>
      prev
        .map((pulse) => ({
          ...pulse,
          scale: pulse.scale + delta * 2,
          opacity: Math.max(0, pulse.opacity - delta * 0.5),
        }))
        .filter((pulse) => pulse.opacity > 0)
    );

    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {pulses.map((pulse) => (
        <group key={pulse.id}>
          {/* Onda esférica */}
          <mesh scale={pulse.scale}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial
              color="#00d9ff"
              transparent
              opacity={pulse.opacity * 0.2}
              blending={THREE.AdditiveBlending}
              side={THREE.BackSide}
              wireframe
            />
          </mesh>

          {/* Destello central */}
          <mesh scale={pulse.scale * 0.5}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={pulse.opacity * 0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
