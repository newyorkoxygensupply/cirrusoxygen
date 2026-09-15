"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { InstancedMesh, Object3D, type Group } from "three";

/**
 * The twin-bed PSA process from "how-oxygen-concentrators-work-psa-sieve-
 * beds" rendered as a physical cutaway: two machined canisters, one column
 * metering concentrated O2 down and out (the accent-colored stream), the
 * other venting adsorbed nitrogen up and away (the neutral stream) — the
 * same mechanism the 2D diagram explains, staged like the O2 molecule shot.
 */
const CANISTER_HEIGHT = 2.6;
const CANISTER_RADIUS = 0.5;
const PARTICLE_COUNT = 7;

function Canister({ x, accent }: { x: number; accent: boolean }) {
  return (
    <group position={[x, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[CANISTER_RADIUS, CANISTER_RADIUS, CANISTER_HEIGHT, 48]} />
        <meshStandardMaterial color="#c9cbcd" metalness={1} roughness={0.28} />
      </mesh>
      {/* banding rings — reads as a machined vessel, not a plain tube */}
      {[-0.7, 0, 0.7].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[CANISTER_RADIUS + 0.01, 0.025, 16, 48]} />
          <meshStandardMaterial color={accent ? "#d4a256" : "#8a9089"} metalness={1} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function ParticleStream({ x, direction, color, paused }: { x: number; direction: 1 | -1; color: string; paused: boolean }) {
  const ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const offsets = useMemo(
    () => Array.from({ length: PARTICLE_COUNT }, (_, i) => i / PARTICLE_COUNT),
    []
  );

  useFrame((state) => {
    if (!ref.current) return;
    const t = paused ? 0 : state.clock.elapsedTime;
    offsets.forEach((offset, i) => {
      const span = CANISTER_HEIGHT * 0.86;
      const cycle = ((t * 0.18 + offset) % 1) * span - span / 2;
      const y = direction * cycle * -1;
      dummy.position.set(x + Math.sin((offset + t * 0.3) * Math.PI * 2) * 0.12, y, 0);
      dummy.scale.setScalar(0.07);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} metalness={0.2} roughness={0.3} />
    </instancedMesh>
  );
}

function Scene({ paused }: { paused: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const targetY = state.pointer.x * 0.35;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
  });

  return (
    <group ref={group}>
      <Canister x={-1.05} accent={true} />
      <Canister x={1.05} accent={false} />
      {/* base manifold bar */}
      <mesh position={[0, -CANISTER_HEIGHT / 2 - 0.12, 0]} castShadow>
        <boxGeometry args={[2.7, 0.14, 0.5]} />
        <meshStandardMaterial color="#a7abad" metalness={1} roughness={0.3} />
      </mesh>
      <ParticleStream x={-1.05} direction={1} color="#5cae8c" paused={paused} />
      <ParticleStream x={1.05} direction={-1} color="#9aa39c" paused={paused} />
    </group>
  );
}

export default function SieveBedCutaway3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.3, 5.4], fov: 36 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
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
