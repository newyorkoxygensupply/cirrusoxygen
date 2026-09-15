"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { Group, Mesh } from "three";

/**
 * A real aviation altimeter mechanism, not a fabricated product shot: a
 * sealed aneroid capsule that flexes with air pressure, geared to a needle
 * on a dial. It's the honest, classic way to render "FAA cabin-pressure
 * ceiling" — the same instrument language a real cockpit altimeter uses,
 * not an invented device.
 */
function Instrument({ paused }: { paused: boolean }) {
  const needleRef = useRef<Group>(null);
  const capsuleRefs = useRef<(Mesh | null)[]>([]);
  const ticks = useMemo(() => Array.from({ length: 36 }), []);

  useFrame((state) => {
    const t = paused ? 0 : state.clock.elapsedTime;
    const sweep = paused ? 0.6 : (Math.sin(t * 0.35) + 1) / 2;
    if (needleRef.current) {
      needleRef.current.rotation.z = -sweep * Math.PI * 1.4 + Math.PI * 0.7;
    }
    capsuleRefs.current.forEach((c, i) => {
      if (!c) return;
      const breathe = paused ? 0 : Math.sin(t * 0.35 + i * 0.3) * 0.02;
      c.scale.setScalar(1 + breathe);
    });
  });

  return (
    <group>
      {/* dial bezel */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.15, 0.05, 16, 64]} />
        <meshStandardMaterial color="#c9cbcd" metalness={1} roughness={0.2} />
      </mesh>
      {ticks.map((_, i) => {
        const a = (i / ticks.length) * Math.PI * 2;
        const bold = i % 3 === 0;
        const r1 = bold ? 0.86 : 0.92;
        return (
          <mesh key={i} position={[Math.cos(a) * (r1 + 1.02) * 0.5, Math.sin(a) * (r1 + 1.02) * 0.5, 0.06]} rotation={[0, 0, a]}>
            <boxGeometry args={[bold ? 0.03 : 0.018, 1.02 - r1, 0.02]} />
            <meshStandardMaterial color="#8a9089" metalness={0.6} roughness={0.4} />
          </mesh>
        );
      })}
      {/* aneroid capsule stack, visible behind the dial face */}
      <group position={[0, 0, -0.15]}>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            ref={(el) => {
              capsuleRefs.current[i] = el;
            }}
            position={[0, 0, i * 0.09]}
          >
            <torusGeometry args={[0.32, 0.07, 16, 32]} />
            <meshStandardMaterial color="#5cae8c" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>
      {/* needle */}
      <group ref={needleRef}>
        <mesh position={[0.42, 0, 0.1]}>
          <coneGeometry args={[0.06, 0.9, 16]} />
          <meshStandardMaterial color="#d4a256" metalness={1} roughness={0.12} emissive="#a35a26" emissiveIntensity={0.3} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.12]}>
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshStandardMaterial color="#d4a256" metalness={1} roughness={0.1} />
      </mesh>
    </group>
  );
}

function Scene({ paused }: { paused: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!paused) group.current.rotation.y += delta * 0.1;
    const targetX = state.pointer.y * 0.2;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group}>
      <Instrument paused={paused} />
    </group>
  );
}

export default function AltitudeCapsule3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
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
