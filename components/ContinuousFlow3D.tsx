"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { InstancedMesh, Object3D, type Group } from "three";

/**
 * The other half of the pulse-dose contrast: a stationary unit doesn't wait
 * for a breath — it runs a steady, uninterrupted stream at a set LPM the
 * whole time it's powered, which is why continuous flow supports higher
 * prescriptions than a portable's pulse can reach. Particles here are
 * staggered evenly through the cycle rather than firing together, so the
 * stream reads as constant, not bursty — the opposite motion signature of
 * the pulse-dose piece on the portable page.
 */
const PARTICLES = 10;

function Nozzle({ paused }: { paused: boolean }) {
  const particlesRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const offsets = useMemo(
    () => Array.from({ length: PARTICLES }, (_, i) => ({ phase: i / PARTICLES, jitter: (Math.random() - 0.5) * 0.15 })),
    []
  );

  useFrame((state) => {
    if (!particlesRef.current) return;
    const t = paused ? 0 : state.clock.elapsedTime;
    offsets.forEach(({ phase, jitter }, i) => {
      const cycle = ((t * 0.35 + phase) % 1);
      const y = cycle * 2.1;
      dummy.position.set(jitter * cycle, 0.55 + y, jitter * cycle * 0.7);
      dummy.scale.setScalar(0.065);
      dummy.updateMatrix();
      particlesRef.current!.setMatrixAt(i, dummy.matrix);
    });
    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.55, 1, 48]} />
        <meshStandardMaterial color="#c9cbcd" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 0.35, 32]} />
        <meshStandardMaterial color="#8a9089" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* flow-rate dial ring — ticks reading like a real LPM gauge */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const r1 = 0.62;
        const r2 = 0.7;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * (r1 + r2) * 0.5, -0.5, Math.sin(a) * (r1 + r2) * 0.5]}
            rotation={[0, -a, 0]}
          >
            <boxGeometry args={[0.02, 0.08, r2 - r1]} />
            <meshStandardMaterial color="#8a9089" metalness={0.6} roughness={0.4} />
          </mesh>
        );
      })}
      <instancedMesh ref={particlesRef} args={[undefined, undefined, PARTICLES]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#5cae8c" emissive="#5cae8c" emissiveIntensity={0.85} metalness={0.2} roughness={0.3} />
      </instancedMesh>
    </group>
  );
}

function Scene({ paused }: { paused: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!paused) group.current.rotation.y += delta * 0.15;
    const targetX = state.pointer.y * 0.15;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      <Nozzle paused={paused} />
    </group>
  );
}

export default function ContinuousFlow3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.3, 4.6], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
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
