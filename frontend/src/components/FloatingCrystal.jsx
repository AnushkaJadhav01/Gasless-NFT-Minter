import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const SleekRing = () => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.8}>
        <torusGeometry args={[1, 0.04, 16, 100]} />
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={0.5} />
      </mesh>
      <mesh scale={1.4} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.03, 16, 100]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
      </mesh>
    </Float>
  );
};

const FloatingCrystal = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-80 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <fog attach="fog" args={['#030509', 3, 8]} />
        <SleekRing />
        <Sparkles count={200} scale={12} size={2.5} speed={0.4} opacity={0.4} color="#3B82F6" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default FloatingCrystal;
