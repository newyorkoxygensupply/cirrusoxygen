"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { InstancedMesh, Object3D, Vector2, type Group, type MeshStandardMaterial } from "three";

/**
 * What almost every CPAP mask actually does with exhaled air: a passive
 * diffuser vent — a cluster of small drilled holes, no moving parts —
 * bleeds exhaled CO2 out continuously so it can't pool and be re-breathed.
 * That's a steady, faint wash, not a burst or a pulse, which is what
 * separates this piece's particle timing from the O2-delivery pieces
 * elsewhere on the site: this vents constantly, at rest, all night.
 */
const VENTS = 14;

function ventPositions() {
  const pts: [number, number, number][] = [];
  for (let i = 0; i < VENTS; i++) {
    const a = (i / VENTS) * Math.PI * 2;
    const r = 0.32;
    pts.push([Math.cos(a) * r, Math.sin(a) * r, 0]);
  }
  return pts;
}

function cushionProfile() {
  const pts: Vector2[] = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const y = -0.5 + t * 1.0;
    const r = 0.65 * Math.sin(t * Math.PI) ** 0.6;
    pts.push(new Vector2(Math.max(r, 0.02), y));
  }
  return pts;
}

function Cushion({ paused }: { paused: boolean }) {
  const particlesRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const positions = useMemo(() => ventPositions(), []);
  const profile = useMemo(() => cushionProfile(), []);
  const seeds = useMemo(() => positions.map(() => Math.random()), [positions]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const t = paused ? 0 : state.clock.elapsedTime;
    positions.forEach(([x, y, z], i) => {
      const local = paused ? 0.4 : (t * 0.35 + seeds[i]) % 1;
      dummy.position.set(x * (1 + local * 0.7), y * (1 + local * 0.7), z + 0.35 + local * 0.9);
      const scale = 0.02 * (1 - local * 0.6);
      dummy.scale.setScalar(Math.max(scale, 0.002));
      dummy.updateMatrix();
      particlesRef.current!.setMatrixAt(i, dummy.matrix);
    });
    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group rotation={[0, 0, Math.PI]}>
      {/* face-hint backing plate */}
      <mesh position={[0, 0, -0.5]}>
        <circleGeometry args={[0.85, 32]} />
        <meshStandardMaterial color="#1c211f" roughness={0.9} metalness={0} />
      </mesh>
      {/* silicone cushion, revolved profile */}
      <mesh castShadow>
        <latheGeometry args={[profile, 48]} />
        <meshPhysicalMaterial color="#e7e1d6" transmission={0.25} thickness={0.6} roughness={0.35} metalness={0} />
      </mesh>
      {/* vent cluster */}
      {positions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z + 0.5]}>
          <circleGeometry args={[0.03, 12]} />
          <meshStandardMaterial color="#0b0e0c" />
        </mesh>
      ))}
      {/* continuous diffuse exhalation wisps */}
      <instancedMesh ref={particlesRef} args={[undefined, undefined, VENTS]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#c9cbcd" emissive="#5cae8c" emissiveIntensity={0.4} transparent opacity={0.55} />
      </instancedMesh>
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
      <Cushion paused={paused} />
    </group>
  );
}

export default function MaskSeal3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 5.2], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
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
