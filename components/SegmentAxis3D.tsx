"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { Group } from "three";

/**
 * The exact same honest abstraction as the 2D VentilatorSegmentsDiagram —
 * a capability axis, not fabricated device silhouettes, because we have no
 * real reference geometry for any of these four classes. Node size still
 * encodes capability, position still encodes the same real spread; the only
 * thing that changed is staging it like a precision instrument instead of a
 * flat line drawing. Real anchor: $12,500 transport to $58,000 MRI-
 * conditional, from "ventilator-classes-icu-transport-mri-explained."
 */
const NODES = [
  { x: -1.65, r: 0.2, flagship: false },
  { x: -0.6, r: 0.32, flagship: false },
  { x: 0.52, r: 0.4, flagship: true },
  { x: 1.65, r: 0.28, flagship: false },
];

function Scene({ paused }: { paused: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!paused) group.current.rotation.y += delta * 0.12;
    const targetX = state.pointer.y * 0.15;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group}>
      {/* the rail */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 3.6, 24]} />
        <meshStandardMaterial color="#a7abad" metalness={1} roughness={0.3} />
      </mesh>
      {NODES.map((n) => (
        <group key={n.x} position={[n.x, 0, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[n.r, 48, 48]} />
            <meshStandardMaterial
              color={n.flagship ? "#d4a256" : "#5cae8c"}
              metalness={1}
              roughness={n.flagship ? 0.12 : 0.3}
              emissive={n.flagship ? "#a35a26" : "#000000"}
              emissiveIntensity={n.flagship ? 0.15 : 0}
            />
          </mesh>
          {/* tick mark beneath each node, reading like a ruler */}
          <mesh position={[0, -0.62, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.3, 8]} />
            <meshStandardMaterial color="#8a9089" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function SegmentAxis3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.6, 5.2], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
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
