import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

const AnimatedSphere = ({ color, position, args, distort, speed }) => {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.005;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <Sphere ref={meshRef} position={position} args={args}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distort}
        speed={speed}
        roughness={0.2}
      />
    </Sphere>
  );
};

export default function BackgroundScene() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-slate-950 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-cyan-600/10 blur-[100px]" />
      
      {/* 3D Scene */}
      <Canvas className="absolute inset-0 z-0">
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1} />
        <AnimatedSphere color="#3b82f6" position={[-3, 1, -5]} args={[1.2, 64, 64]} distort={0.4} speed={2} />
        <AnimatedSphere color="#8b5cf6" position={[4, -2, -6]} args={[1.5, 64, 64]} distort={0.5} speed={1.5} />
        <AnimatedSphere color="#06b6d4" position={[2, 3, -8]} args={[1, 64, 64]} distort={0.3} speed={3} />
      </Canvas>
    </div>
  );
}
