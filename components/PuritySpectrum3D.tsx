"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import type { Group } from "three";

/**
 * A honest proportion, not a precise ratio: every spec sheet in the
 * category reads 87–96% oxygen purity, so this cluster is built at roughly
 * 9:1 — illustrative of "mostly O2, a little residual N2," not a claim
 * about any single model's exact output. The real number always lives in
 * the text next to it, never implied more precisely by the render than the
 * copy states.
 */
const O2_POSITIONS: [number, number, number][] = [
  [-0.9, 0.6, 0], [0, 0.8, 0.3], [0.9, 0.5, -0.2], [-0.6, -0.3, 0.4],
  [0.5, -0.5, 0.2], [-1.1, -0.7, -0.3], [1.1, -0.2, 0.4], [0.1, 0.1, -0.5],
  [-0.2, -1.0, 0],
];
const N2_POSITION: [number, number, number] = [0.3, 1.1, -0.1];

function Scene({ paused }: { paused: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!paused) group.current.rotation.y += delta * 0.13;
    const targetX = state.pointer.y * 0.18;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group}>
      <Float speed={paused ? 0 : 1.1} rotationIntensity={0} floatIntensity={paused ? 0 : 0.35}>
        {O2_POSITIONS.map((p, i) => (
          <mesh key={i} position={p} castShadow>
            <sphereGeometry args={[0.34, 32, 32]} />
            <meshStandardMaterial color="#5cae8c" metalness={0.5} roughness={0.25} emissive="#5cae8c" emissiveIntensity={0.15} />
          </mesh>
        ))}
        <mesh position={N2_POSITION} castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#8a9089" metalness={0.6} roughness={0.35} />
        </mesh>
      </Float>
    </group>
  );
}

export default function PuritySpectrum3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.2, 5.4], fov: 36 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 4]} intensity={1.5} color="#fff3e2" castShadow />
      <directionalLight position={[-4, 1, -2]} intensity={0.6} color="#5cae8c" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2} color="#fff3e2" position={[3, 2, 3]} scale={[4, 3, 1]} />
        <Lightformer form="rect" intensity={1} color="#5cae8c" position={[-3, -1, 2]} rotation={[0, Math.PI / 3, 0]} scale={[3, 3, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#e08a4d" position={[0, -2, -4]} scale={5} />
      </Environment>
      <Scene paused={paused} />
    </Canvas>
  );
}
