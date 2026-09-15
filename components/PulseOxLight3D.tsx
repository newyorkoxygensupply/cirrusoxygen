"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { Group, Mesh, MeshStandardMaterial } from "three";

/**
 * How a pulse oximeter actually reads SpO2: two wavelengths of light — red
 * and infrared — shine through tissue, and the ratio of what gets absorbed
 * versus what passes through (which changes with each heartbeat, as
 * arterial blood volume pulses) is the entire measurement. No fabricated
 * finger-clip housing — just the two beams and the pulse they're reading,
 * staged the same way as the site's other mechanism pieces.
 */
function beatPulse(t: number) {
  const cycle = t % 1;
  if (cycle < 0.15) return Math.sin((cycle / 0.15) * Math.PI);
  return 0;
}

function Beams({ paused }: { paused: boolean }) {
  const redRef = useRef<Mesh>(null);
  const irRef = useRef<Mesh>(null);
  const tissueRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = paused ? 0 : state.clock.elapsedTime * 1.1;
    const pulse = paused ? 0.4 : beatPulse(t);
    if (redRef.current) {
      (redRef.current.material as MeshStandardMaterial).emissiveIntensity = 0.6 + pulse * 1.1;
    }
    if (irRef.current) {
      (irRef.current.material as MeshStandardMaterial).emissiveIntensity = 0.4 + pulse * 0.7;
    }
    if (tissueRef.current) {
      (tissueRef.current.material as MeshStandardMaterial).emissiveIntensity = 0.08 + pulse * 0.18;
    }
  });

  return (
    <group>
      {/* the tissue the light passes through */}
      <mesh ref={tissueRef} castShadow>
        <capsuleGeometry args={[0.55, 1.6, 8, 32]} />
        <meshPhysicalMaterial
          color="#c98a6f"
          transmission={0.55}
          thickness={0.8}
          roughness={0.3}
          metalness={0}
          emissive="#e05c3a"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* red beam */}
      <mesh ref={redRef} position={[-0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 2.4, 16]} />
        <meshStandardMaterial color="#e05c3a" emissive="#e05c3a" emissiveIntensity={0.7} />
      </mesh>
      {/* infrared beam, rendered as a deep visible marker since true IR has no color */}
      <mesh ref={irRef} position={[0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 2.4, 16]} />
        <meshStandardMaterial color="#7b3fa0" emissive="#7b3fa0" emissiveIntensity={0.5} />
      </mesh>
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
    <group ref={group} rotation={[0, 0, Math.PI / 2]}>
      <Beams paused={paused} />
    </group>
  );
}

export default function PulseOxLight3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.2, 5.4], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
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
