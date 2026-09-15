"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { InstancedMesh, Object3D, type Group, type Mesh, type MeshStandardMaterial } from "three";

/**
 * The one piece on this site depicting intake rather than delivery: a
 * suction unit's vacuum pump draws fluid through a catheter tip into a
 * collection canister. The real safety detail is the float valve — a ball
 * that rises with the fluid level and seals the line before it can reach
 * and damage the pump motor. Droplets travel inward here, the fluid level
 * climbs, and the float shuts the line at the fill mark, then the cycle
 * resets for a fresh canister.
 */
const PARTICLES = 10;
const CYCLE = 5.4;

function Canister({ paused }: { paused: boolean }) {
  const particlesRef = useRef<InstancedMesh>(null);
  const fluidRef = useRef<Mesh>(null);
  const floatRef = useRef<Mesh>(null);
  const sealRef = useRef<Mesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const seeds = useMemo(() => Array.from({ length: PARTICLES }, () => Math.random()), []);

  useFrame((state) => {
    const t = paused ? 0 : state.clock.elapsedTime;
    const cycleT = (t % CYCLE) / CYCLE;
    const filling = Math.min(cycleT / 0.85, 1);
    const level = -0.55 + filling * 1.0;
    const sealed = cycleT > 0.85;

    if (fluidRef.current) {
      fluidRef.current.position.y = level / 2 - 0.55;
      fluidRef.current.scale.y = Math.max(level + 0.55, 0.02);
    }
    if (floatRef.current) {
      floatRef.current.position.y = level;
    }
    if (sealRef.current) {
      const mat = sealRef.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = sealed ? 0.9 : 0.2;
      sealRef.current.rotation.x = sealed ? Math.PI / 2 : 0;
    }
    if (particlesRef.current) {
      const flowing = !sealed;
      seeds.forEach((seed, i) => {
        const local = flowing ? (t * 0.7 + seed) % 1 : 1;
        const x = 1.3 - local * 1.0;
        dummy.position.set(x, 0.5 - local * 0.15, 0);
        const scale = flowing ? 0.045 * (1 - local * 0.3) : 0;
        dummy.scale.setScalar(Math.max(scale, 0));
        dummy.updateMatrix();
        particlesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* canister shell, translucent */}
      <mesh castShadow>
        <cylinderGeometry args={[0.55, 0.55, 1.7, 40]} />
        <meshPhysicalMaterial color="#dfe2e0" transmission={0.55} thickness={0.5} roughness={0.15} metalness={0} />
      </mesh>
      {/* fluid level */}
      <mesh ref={fluidRef} position={[0, -0.55, 0]} scale={[1, 0.02, 1]}>
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        <meshStandardMaterial color="#e08a4d" transparent opacity={0.55} />
      </mesh>
      {/* float valve ball */}
      <mesh ref={floatRef} position={[0, -0.55, 0]}>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial color="#d4a256" metalness={1} roughness={0.15} />
      </mesh>
      {/* fill line marker */}
      <mesh position={[0, 0.5, 0.5]}>
        <boxGeometry args={[0.4, 0.02, 0.01]} />
        <meshStandardMaterial color="#8a9089" />
      </mesh>
      {/* intake tube */}
      <mesh position={[1.3, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.9, 16]} />
        <meshStandardMaterial color="#c9cbcd" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* seal flap at canister neck */}
      <mesh ref={sealRef} position={[0.85, 0.5, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
        <meshStandardMaterial color="#5cae8c" emissive="#5cae8c" emissiveIntensity={0.2} />
      </mesh>
      {/* inbound fluid droplets */}
      <instancedMesh ref={particlesRef} args={[undefined, undefined, PARTICLES]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#e08a4d" emissive="#a3542a" emissiveIntensity={0.4} />
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
      <Canister paused={paused} />
    </group>
  );
}

export default function SuctionUnit3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.1, 5.6], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
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
