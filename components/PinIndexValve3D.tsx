"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { DoubleSide, type Group, type Mesh, type MeshStandardMaterial } from "three";

/**
 * The CGA-870 pin-index safety system: a valve post carries two pins in a
 * fixed, gas-specific position, and only a matching yoke connector's holes
 * will seat over them. Wrong gas, wrong pin position, no connection — a
 * mechanical interlock, not a label you could ignore. Rendered as the yoke
 * docking onto the post and a collar tightening to seal it, then backing
 * off to repeat, since that approach-and-lock motion is the whole point.
 */
const CYCLE = 3.4;

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function Assembly({ paused }: { paused: boolean }) {
  const yokeRef = useRef<Group>(null);
  const collarRef = useRef<Mesh>(null);
  const glowRefs = useRef<(Mesh | null)[]>([]);

  useFrame((state) => {
    const t = paused ? 0 : state.clock.elapsedTime;
    const cycleT = (t % CYCLE) / CYCLE;

    // approach (0-0.35), seated + tighten (0.35-0.7), hold (0.7-0.85), retreat (0.85-1)
    let z: number;
    let seated: number;
    if (cycleT < 0.35) {
      z = 1.1 * (1 - easeInOutCubic(cycleT / 0.35));
      seated = 0;
    } else if (cycleT < 0.85) {
      z = 0;
      seated = 1;
    } else {
      const back = easeInOutCubic((cycleT - 0.85) / 0.15);
      z = 1.1 * back;
      seated = 1 - back;
    }

    if (yokeRef.current) {
      yokeRef.current.position.z = z;
    }
    if (collarRef.current) {
      collarRef.current.rotation.z = seated * Math.PI * 1.2;
    }
    glowRefs.current.forEach((g) => {
      if (!g) return;
      const mat = g.material as MeshStandardMaterial;
      mat.emissiveIntensity = 0.2 + seated * 1.1;
    });
  });

  const pinOffsets: [number, number][] = [
    [0, 0.32],
    [0.24, -0.16],
  ];

  return (
    <group>
      {/* valve post */}
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.4, 48]} />
        <meshStandardMaterial color="#c9cbcd" metalness={1} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.06, 48]} />
        <meshStandardMaterial color="#8a9089" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* index holes, gas-specific position */}
      {pinOffsets.map(([x, y], i) => (
        <mesh key={i} position={[x, 0.7, y]}>
          <cylinderGeometry args={[0.05, 0.05, 0.14, 16]} />
          <meshStandardMaterial color="#0b0e0c" />
        </mesh>
      ))}

      {/* yoke: docks over the post, pins slide into the holes */}
      <group ref={yokeRef} position={[0, 0, 1.1]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.56, 0.56, 0.5, 48, 1, true]} />
          <meshStandardMaterial color="#d4a256" metalness={1} roughness={0.18} side={DoubleSide} />
        </mesh>
        {pinOffsets.map(([x, y], i) => (
          <mesh
            key={i}
            ref={(el) => {
              glowRefs.current[i] = el;
            }}
            position={[x, y, -0.55]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.045, 0.045, 0.9, 16]} />
            <meshStandardMaterial color="#d4a256" metalness={1} roughness={0.15} emissive="#a35a26" emissiveIntensity={0.2} />
          </mesh>
        ))}
        {/* tightening collar */}
        <mesh ref={collarRef} position={[0, 0, -0.02]}>
          <torusGeometry args={[0.58, 0.06, 12, 6]} />
          <meshStandardMaterial color="#8a9089" metalness={0.9} roughness={0.3} />
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
    <group ref={group} rotation={[0, Math.PI * 0.15, 0]}>
      <Assembly paused={paused} />
    </group>
  );
}

export default function PinIndexValve3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.15, 5.6], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
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
