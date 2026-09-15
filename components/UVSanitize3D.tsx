"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { Group, Mesh, MeshStandardMaterial } from "three";

/**
 * The mechanism behind the sanitizers this page actually sells (SoClean,
 * Lumin): a sealed chamber, a UV-C germicidal lamp, no water or chemicals —
 * just a timed exposure cycle. True UV-C sits outside visible light, so
 * like the infrared beam elsewhere on this site, the lamp is rendered with
 * a representative violet glow rather than an invented "real" color, noted
 * here rather than left for the viewer to assume is literal.
 */
const CYCLE = 5.5;

function Chamber({ paused }: { paused: boolean }) {
  const lampRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = paused ? 0 : state.clock.elapsedTime;
    const cycleT = (t % CYCLE) / CYCLE;
    // lamp holds "on" for most of the cycle, then a brief dark reset gap
    const on = cycleT < 0.78 ? 1 : 0;
    const flicker = on * (0.85 + Math.sin(t * 14) * 0.05);

    if (lampRef.current) {
      (lampRef.current.material as MeshStandardMaterial).emissiveIntensity = 0.6 + flicker * 1.4;
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as MeshStandardMaterial;
      mat.opacity = 0.06 + flicker * 0.22;
    }
  });

  return (
    <group>
      {/* sealed chamber shell */}
      <mesh castShadow>
        <capsuleGeometry args={[0.75, 1.3, 8, 32]} />
        <meshPhysicalMaterial color="#dfe2e0" transmission={0.65} thickness={0.5} roughness={0.15} metalness={0} />
      </mesh>
      {/* interior irradiation glow */}
      <mesh ref={glowRef}>
        <capsuleGeometry args={[0.6, 1.1, 8, 32]} />
        <meshStandardMaterial color="#9b7fe0" emissive="#9b7fe0" transparent opacity={0.1} />
      </mesh>
      {/* UV-C lamp rod */}
      <mesh ref={lampRef} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 1.7, 16]} />
        <meshStandardMaterial color="#c9c2f0" emissive="#9b7fe0" emissiveIntensity={0.6} metalness={0} roughness={0.2} />
      </mesh>
      {/* end caps, chrome */}
      {[-0.87, 0.87].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.75, 0.75, 0.06, 32]} />
          <meshStandardMaterial color="#c9cbcd" metalness={1} roughness={0.2} />
        </mesh>
      ))}
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
      <Chamber paused={paused} />
    </group>
  );
}

export default function UVSanitize3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.1, 5.4], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
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
