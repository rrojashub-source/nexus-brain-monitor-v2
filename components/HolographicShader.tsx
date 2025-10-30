'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float time;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    vec3 pos = position;
    float wave = sin(pos.y * 3.0 + time) * 0.05;
    pos += normal * wave;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform float opacity;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
    
    float scanline = sin(vPosition.y * 20.0 + time * 2.0) * 0.5 + 0.5;
    float pulse = sin(time * 3.0) * 0.5 + 0.5;
    
    vec3 color = mix(color1, color2, fresnel);
    color = mix(color, color3, scanline * 0.3);
    
    float alpha = fresnel * opacity + scanline * 0.2 + pulse * 0.1;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

interface HolographicShaderProps {
  opacity?: number;
}

export default function HolographicShader({ opacity = 0.3 }: HolographicShaderProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  const uniforms = {
    time: { value: 0 },
    color1: { value: new THREE.Color('#004466') },
    color2: { value: new THREE.Color('#1a1a3e') },
    color3: { value: new THREE.Color('#002244') },
    opacity: { value: opacity * 0.3 },
  };

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.2, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
