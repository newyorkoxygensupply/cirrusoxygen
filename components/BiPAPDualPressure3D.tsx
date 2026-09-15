"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { Group, Mesh, MeshStandardMaterial } from "three";

/**
 * The real distinction from CPAP: BiPAP doesn't hold one pressure — it
 * steps between two, a higher IPAP on the inhale and a lower EPAP on the
 * exhale, easing breathing effort in a way a single fixed pressure can't.
 * Two marked levels on the sleeve, a piston that settles at one or the
 * other rather than drifting continuously, is the honest way to show a
 * binary alternation instead of the CPAP piece's continuous adjustment.
 */
function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function Column({ paused }: { paused: boolean }) {
  const pistonRef = useRef<Group>(null);
  const markerRef = useRef<Mesh>(null);
  const ipapRing = useRef<Mesh>(null);
  const epapRing = useRef<Mesh>(null);

  useFrame((state) => {
    const t = paused ? 0 : state.clock.elapsedTime;
    const CYCLE = 3.2;
    const cycleT = (t % CYCLE) / CYCLE;
    // hold at each level, ease during the transition
    const raw = cycleT < 0.45 ? 0 : cycleT < 0.55 ? (cycleT - 0.45) / 0.1 : cycleT < 1.0 ? 1 : 0;
    const level = easeInOutCubic(Math.min(Math.max(raw, 0), 1));
    const high = 0.55;
    const low = -0.55;

    if (pistonRef.current) {
      pistonRef.current.position.y = low + level * (high - low);
    }
    if (markerRef.current) {
      const mat = markerRef.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = 0.35 + level * 0.4;
      mat.color.set(level > 0.5 ? "#d4a256" : "#5cae8c");
      mat.emissive.set(level > 0.5 ? "#a35a26" : "#5cae8c");
    }
    if (ipapRing.current) {
      (ipapRing.current.material as MeshStandardMaterial).emissiveIntensity = 0.15 + level * 0.5;
    }
    if (epapRing.current) {
      (epapRing.current.material as MeshStandardMaterial).emissiveIntensity = 0.15 + (1 - level) * 0.5;
    }
  });

  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.55, 0.55, 2.4, 48, 1, true]} />
        <meshStandardMaterial color="#c9cbcd" metalness={0.9} roughness={0.35} transparent opacity={0.32} />
      </mesh>
      {/* IPAP (high) marker ring */}
      <mesh ref={ipapRing} position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.56, 0.63, 48]} />
        <meshStandardMaterial color="#d4a256" emissive="#a35a26" emissiveIntensity={0.3} />
      </mesh>
      {/* EPAP (low) marker ring */}
      <mesh ref={epapRing} position={[0, -0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.56, 0.63, 48]} />
        <meshStandardMaterial color="#5cae8c" emissive="#5cae8c" emissiveIntensity={0.3} />
      </mesh>
      <group ref={pistonRef}>
        <mesh ref={markerRef} castShadow>
          <cylinderGeometry args={[0.44, 0.44, 0.3, 48]} />
          <meshStandardMaterial color="#5cae8c" metalness={1} roughness={0.15} emissive="#5cae8c" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0, -0.6, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.9, 48]} />
          <meshStandardMaterial color="#c9cbcd" metalness={0.7} roughness={0.3} />
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

export default function BiPAPDualPressure3D({ paused = false }: { paused?: boolean }) {
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
