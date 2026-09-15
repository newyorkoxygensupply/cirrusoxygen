"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { CatmullRomCurve3, Vector3, type Group, type Mesh, type MeshStandardMaterial } from "three";

/**
 * A real two-stage regulator: cylinder pressure (near-full to near-empty
 * over the tank's life) is stepped down by a spring-loaded diaphragm to a
 * steady delivery pressure, while a Bourdon-tube content gauge reads
 * remaining volume. The needle sweep and gauge-face color are the same
 * honest fuel-gauge language used elsewhere on the site — full reads green,
 * empty reads warm amber — and the coiled spring inside the bonnet is the
 * mechanical part actually doing the pressure reduction.
 */
const CYCLE = 6;

function springPoints() {
  const pts: Vector3[] = [];
  const turns = 5;
  const segments = 64;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2 * turns;
    pts.push(new Vector3(Math.cos(angle) * 0.18, t * 0.9 - 0.45, Math.sin(angle) * 0.18));
  }
  return pts;
}

function Regulator({ paused }: { paused: boolean }) {
  const needleRef = useRef<Group>(null);
  const needleMatRef = useRef<Mesh>(null);
  const faceRef = useRef<Mesh>(null);
  const springRef = useRef<Group>(null);

  const springCurve = useMemo(() => new CatmullRomCurve3(springPoints()), []);
  const tickMarks = useMemo(() => Array.from({ length: 11 }), []);

  useFrame((state) => {
    const t = paused ? 0 : state.clock.elapsedTime;
    const cycleT = (t % CYCLE) / CYCLE;
    // slow depletion, then a brief bright reset flash for "fresh cylinder"
    const depleting = cycleT < 0.82;
    const level = depleting ? 1 - cycleT / 0.82 : 1;
    const flash = depleting ? 0 : Math.sin(((cycleT - 0.82) / 0.18) * Math.PI);

    if (needleRef.current) {
      needleRef.current.rotation.z = -Math.PI * 0.75 + level * Math.PI * 1.5;
    }
    if (needleMatRef.current) {
      const mat = needleMatRef.current.material as MeshStandardMaterial;
      mat.color.setHex(level > 0.5 ? 0x5cae8c : 0xd08a4d);
      mat.emissive.setHex(level > 0.5 ? 0x5cae8c : 0xa3542a);
      mat.emissiveIntensity = 0.35 + flash * 1.2;
    }
    if (faceRef.current) {
      (faceRef.current.material as MeshStandardMaterial).emissiveIntensity = 0.06 + flash * 0.3;
    }
    if (springRef.current) {
      const breathe = paused ? 1 : 1 + Math.sin(t * 1.6) * 0.04;
      springRef.current.scale.y = breathe;
    }
  });

  return (
    <group>
      {/* regulator body, first stage */}
      <mesh position={[0, -0.55, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.56, 0.9, 48]} />
        <meshStandardMaterial color="#c9cbcd" metalness={1} roughness={0.25} />
      </mesh>
      {/* bonnet, translucent, spring visible inside */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.46, 0.5, 0.7, 48, 1, true]} />
        <meshStandardMaterial color="#dfe2e0" metalness={0.6} roughness={0.3} transparent opacity={0.28} />
      </mesh>
      <group ref={springRef} position={[0, 0.15, 0]}>
        <mesh>
          <tubeGeometry args={[springCurve, 96, 0.03, 8, false]} />
          <meshStandardMaterial color="#8a9089" metalness={0.85} roughness={0.35} />
        </mesh>
      </group>

      {/* content gauge dial */}
      <group position={[0, 0.75, 0.42]}>
        <mesh ref={faceRef}>
          <circleGeometry args={[0.42, 48]} />
          <meshStandardMaterial color="#0b0e0c" emissive="#5cae8c" emissiveIntensity={0.06} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <ringGeometry args={[0.42, 0.47, 48]} />
          <meshStandardMaterial color="#c9cbcd" metalness={1} roughness={0.2} />
        </mesh>
        {tickMarks.map((_, i) => {
          const a = Math.PI * 0.25 + (i / (tickMarks.length - 1)) * Math.PI * 1.5;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.36, Math.sin(a) * 0.36, 0.01]} rotation={[0, 0, a]}>
              <boxGeometry args={[0.05, 0.012, 0.01]} />
              <meshStandardMaterial color="#8a9089" />
            </mesh>
          );
        })}
        <group ref={needleRef} position={[0, 0, 0.02]}>
          <mesh ref={needleMatRef} position={[0.16, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.035, 0.34, 12]} />
            <meshStandardMaterial color="#5cae8c" metalness={1} roughness={0.15} emissive="#5cae8c" emissiveIntensity={0.35} />
          </mesh>
        </group>
        <mesh position={[0, 0, 0.03]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#d4a256" metalness={1} roughness={0.1} />
        </mesh>
      </group>

      {/* flow-meter ball tube, second stage */}
      <mesh position={[0.6, -0.4, 0]} rotation={[0, 0, Math.PI * 0.06]}>
        <cylinderGeometry args={[0.08, 0.1, 1, 24, 1, true]} />
        <meshStandardMaterial color="#dfe2e0" metalness={0.5} roughness={0.25} transparent opacity={0.3} />
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
    <group ref={group}>
      <Regulator paused={paused} />
    </group>
  );
}

export default function RegulatorGauge3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.1, 5.4], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
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
