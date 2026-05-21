import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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

/**
 * Context lost handler - ensures proper recovery from WebGL context loss
 */
const ContextLossHandler = () => {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (event) => {
      event.preventDefault();
      console.warn('WebGL context lost. Attempting to restore...');
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored successfully');
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);

  return null;
};

/**
 * FloatingCrystal Component
 * Renders THREE.js scene with proper memory management and resource cleanup
 */
const FloatingCrystal = () => {
  const canvasRef = useRef(null);

  // Cleanup function to dispose of THREE.js resources
  const cleanup = (renderer) => {
    if (renderer) {
      try {
        // Dispose of renderer and context
        renderer.forceContextLoss();
        renderer.dispose();
      } catch (e) {
        console.warn('Error disposing renderer:', e);
      }
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-80 mix-blend-screen">
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: false,
        }}
        dpr={Math.min(window.devicePixelRatio, 2)} // Limit to 2x for performance
        onCreated={(state) => {
          // Optimize THREE.js renderer settings
          state.gl.setClearColor(0x030509, 0);
          state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
        onError={(error) => {
          console.error('Canvas error:', error);
        }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <fog attach="fog" args={['#030509', 3, 8]} />

        <SleekRing />
        <Sparkles
          count={200}
          scale={12}
          size={2.5}
          speed={0.4}
          opacity={0.4}
          color="#3B82F6"
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />

        {/* Context loss handler */}
        <ContextLossHandler />
      </Canvas>
    </div>
  );
};

export default FloatingCrystal;
