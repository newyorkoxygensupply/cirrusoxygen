"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { DoubleSide, type Group, type Mesh, type MeshStandardMaterial } from "three";

/**
 * What "auto-titrating" actually means in hardware: the machine doesn't
 * hold one fixed pressure all night — it continuously adjusts within a
 * prescribed range in response to detected resistance. A telescoping
 * column rising and falling on an irregular (not simply periodic) curve,
 * inside a bezel with the same tick-mark language as the site's other
 * instrument dials, reads that adjustment honestly rather than implying a
 * single "the pressure" number.
 */
function Column({ paused }: { paused: boolean }) {
  const pistonRef = useRef<Group>(null);
  const markerRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = paused ? 0 : state.clock.elapsedTime;
    // sum of two incommensurate frequencies reads as "adjusting", not a clean loop
    const level = 0.5 + 0.5 * (0.6 * Math.sin(t * 0.5) + 0.4 * Math.sin(t * 1.3 + 1.4));
    if (pistonRef.current) {
      pistonRef.current.position.y = -0.5 + level * 1.5;
    }
    if (markerRef.current) {
      const mat = markerRef.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + level * 0.5;
    }
  });

  return (
    <group>
      {/* outer sleeve with pressure-scale ticks */}
      <mesh>
        <cylinderGeometry args={[0.55, 0.55, 2.4, 48, 1, true]} />
        <meshStandardMaterial color="#c9cbcd" metalness={0.9} roughness={0.35} side={DoubleSide} transparent opacity={0.35} />
      </mesh>
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[0, -1.05 + i * 0.26, 0.56]}>
          <boxGeometry args={[0.16, 0.02, 0.02]} />
          <meshStandardMaterial color="#8a9089" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      <group ref={pistonRef}>
        <mesh ref={markerRef} castShadow>
          <cylinderGeometry args={[0.44, 0.44, 0.3, 48]} />
          <meshStandardMaterial color="#d4a256" metalness={1} roughness={0.15} emissive="#a35a26" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0, -0.6, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.9, 48]} />
          <meshStandardMaterial color="#5cae8c" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

function Scene({ paused }: { paused: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!paused) group.current.rotation.y += delta * 0.13;
    const targetX = state.pointer.y * 0.15;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group}>
      <Column paused={paused} />
    </group>
  );
}

export default function PressureTitration3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.2, 5.2], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
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
