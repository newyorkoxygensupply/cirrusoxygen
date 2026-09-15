"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { Group, Mesh, MeshStandardMaterial } from "three";

/**
 * The real component behind every "8-16 hours" battery-life spec: a stacked
 * cell pack. No fabricated device shell — just the cells themselves, staged
 * like the O2 molecule, with a charge indicator sweeping across the pack
 * the way a real fuel gauge does.
 */
const CELLS = [-1.05, 0, 1.05];

function Cell({ x, delay, paused }: { x: number; delay: number; paused: boolean }) {
  const capRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!capRef.current) return;
    const t = paused ? 0 : state.clock.elapsedTime;
    const pulse = paused ? 0.6 : (Math.sin((t - delay) * 1.4) + 1) / 2;
    (capRef.current.material as MeshStandardMaterial).emissiveIntensity = 0.25 + pulse * 0.55;
  });

  return (
    <group position={[x, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.42, 2.2, 48]} />
        <meshStandardMaterial color="#c9cbcd" metalness={1} roughness={0.22} />
      </mesh>
      {/* band ring, like a real cell's printed label band */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.425, 0.425, 0.4, 48]} />
        <meshStandardMaterial color="#0b0e0c" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh ref={capRef} position={[0, 1.14, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.36, 0.14, 32]} />
        <meshStandardMaterial color="#d4a256" metalness={1} roughness={0.15} emissive="#a35a26" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function Scene({ paused }: { paused: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!paused) group.current.rotation.y += delta * 0.14;
    const targetX = state.pointer.y * 0.15;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group}>
      {CELLS.map((x, i) => (
        <Cell key={x} x={x} delay={i * 0.7} paused={paused} />
      ))}
    </group>
  );
}

export default function BatteryCell3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.3, 5.6], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
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
