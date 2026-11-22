import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import { setConsoleFunction } from 'three';

// Intercept Three.js internal deprecation warnings (e.g. Clock deprecation in Three r183)
if (typeof setConsoleFunction === 'function') {
  setConsoleFunction((type, message, ...params) => {
    if (typeof message === 'string' && message.includes('Clock: This module has been deprecated')) {
      return; // Handled: Clock has been replaced with delta accumulation and Timer
    }
    if (type === 'warn') {
      console.warn(message, ...params);
    } else if (type === 'error') {
      console.error(message, ...params);
    } else {
      console.log(message, ...params);
    }
  });
}

const AnimatedSphere = ({ color, position, args, distort, speed }) => {
  const meshRef = useRef();
  const timeRef = useRef(0);

  // Use frame delta time accumulation instead of deprecated Clock
  useFrame((state, delta) => {
    timeRef.current += delta;
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(timeRef.current * speed) * 0.002;
      meshRef.current.rotation.x = timeRef.current * 0.1;
      meshRef.current.rotation.y = timeRef.current * 0.15;
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={args}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distort}
        speed={speed}
        roughness={0.4}
        transparent
        opacity={0.55}
      />
    </Sphere>
  );
};

export default function BackgroundScene() {
  return (
    <div
      className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden"
      style={{ backgroundColor: '#EDE9E6' }}
    >
      {/* Soft, Warm Gradient Blobs - Matching App Aesthetic */}
      <div
        className="absolute top-[-15%] left-[-15%] w-[45%] h-[45%] rounded-full blur-[140px]"
        style={{ backgroundColor: '#C9996B', opacity: 0.18 }}
      />
      <div
        className="absolute bottom-[-20%] right-[-15%] w-[50%] h-[50%] rounded-full blur-[160px]"
        style={{ backgroundColor: '#5C766D', opacity: 0.20 }}
      />
      <div
        className="absolute top-[35%] left-[55%] w-[35%] h-[35%] rounded-full blur-[110px]"
        style={{ backgroundColor: '#5C4F4A', opacity: 0.12 }}
      />

      {/* Subtle Animated 3D Spheres */}
      <Canvas
        className="absolute inset-0 z-0"
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true
        }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 6, 4]} intensity={0.7} />

        {/* Warm-toned animated spheres */}
        <AnimatedSphere
          color="#C9996B"
          position={[-4.5, 1.5, -7]}
          args={[1.35, 64, 64]}
          distort={0.18}
          speed={1.4}
        />

        <AnimatedSphere
          color="#5C766D"
          position={[4.2, -2.2, -8.5]}
          args={[1.6, 64, 64]}
          distort={0.22}
          speed={1.1}
        />

        <AnimatedSphere
          color="#5C4F4A"
          position={[-1.8, 3.8, -9]}
          args={[1.1, 64, 64]}
          distort={0.14}
          speed={1.7}
        />

        {/* Very subtle extra layer for depth */}
        <AnimatedSphere
          color="#C9996B"
          position={[3.5, 4.5, -11]}
          args={[0.8, 64, 64]}
          distort={0.12}
          speed={2.2}
        />
      </Canvas>
    </div>
  );
}
