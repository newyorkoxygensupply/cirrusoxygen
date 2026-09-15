"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { Group, Mesh, MeshStandardMaterial } from "three";

/**
 * The mechanism, not a fabricated device: a mechanical ventilator moves a
 * fixed volume of air in on a controlled inspiration and lets it out on a
 * longer expiration — real respiratory therapy convention is roughly a 1:2
 * inspiration:expiration ratio, which is the timing this bellows actually
 * runs on, not a symmetric back-and-forth.
 */
const RINGS = 6;

function easeInOutSine(x: number) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

function Bellows({ paused }: { paused: boolean }) {
  const ringRefs = useRef<(Mesh | null)[]>([]);
  const capRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = paused ? 0 : state.clock.elapsedTime;
    const CYCLE = 2.4;
    const cycleT = (t % CYCLE) / CYCLE;
    // ~1:2 inhale:exhale timing
    const inhale = cycleT < 0.33;
    const phase = inhale ? cycleT / 0.33 : (cycleT - 0.33) / 0.67;
    const eased = easeInOutSine(phase);
    const expansion = inhale ? eased : 1 - eased;

    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      const baseSpacing = 0.32;
      const spacing = baseSpacing * (0.6 + expansion * 0.7);
      ring.position.y = -0.9 + i * spacing;
      const scale = 1 + expansion * 0.06;
      ring.scale.set(scale, 1, scale);
    });
    if (capRef.current) {
      const mat = capRef.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = 0.2 + expansion * 0.5;
    }
  });

  return (
    <group>
      {Array.from({ length: RINGS }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            ringRefs.current[i] = el;
          }}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <torusGeometry args={[0.55, 0.09, 24, 48]} />
          <meshStandardMaterial color="#c9cbcd" metalness={1} roughness={0.25} />
        </mesh>
      ))}
      <mesh ref={capRef} position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.16, 48]} />
        <meshStandardMaterial color="#d4a256" metalness={1} roughness={0.15} emissive="#a35a26" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, -1.05, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.16, 48]} />
        <meshStandardMaterial color="#8a9089" metalness={0.9} roughness={0.3} />
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
      <Bellows paused={paused} />
    </group>
  );
}

export default function BreathCycle3D({ paused = false }: { paused?: boolean }) {
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
