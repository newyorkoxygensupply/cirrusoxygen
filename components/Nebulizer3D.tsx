"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { InstancedMesh, Object3D, type Group } from "three";

/**
 * A jet nebulizer's real trick: compressed air forced through a narrow jet
 * shears liquid medication into a fine aerosol. Most droplets are too
 * large to inhale usefully and strike the cup's internal baffle, falling
 * back into the reservoir to be re-atomized — only the fine mist escapes
 * upward. Rendered as most particles rising and thinning out while a
 * portion visibly curve back down, since that recirculation is the actual
 * engineering detail, not an invented flourish.
 */
const PARTICLES = 22;

function Mist({ paused }: { paused: boolean }) {
  const particlesRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: PARTICLES }, () => ({
        phase: Math.random(),
        angle: Math.random() * Math.PI * 2,
        radius: 0.08 + Math.random() * 0.18,
        recondense: Math.random() < 0.35,
      })),
    []
  );

  useFrame((state) => {
    if (!particlesRef.current) return;
    const t = paused ? 0 : state.clock.elapsedTime;
    seeds.forEach((s, i) => {
      const local = paused ? 0.4 : (t * 0.4 + s.phase) % 1;
      let y: number;
      let r: number;
      if (s.recondense && local > 0.55) {
        const fall = (local - 0.55) / 0.45;
        y = 0.9 - fall * 1.1;
        r = s.radius * (1 + fall * 1.4);
      } else {
        y = -0.2 + local * 1.1;
        r = s.radius * (1 + local * 0.9);
      }
      dummy.position.set(Math.cos(s.angle) * r, y, Math.sin(s.angle) * r);
      const scale = 0.035 * (1 - Math.min(local, 0.9));
      dummy.scale.setScalar(Math.max(scale, 0.006));
      dummy.updateMatrix();
      particlesRef.current!.setMatrixAt(i, dummy.matrix);
    });
    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={particlesRef} args={[undefined, undefined, PARTICLES]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#eef1ee" emissive="#5cae8c" emissiveIntensity={0.3} transparent opacity={0.7} />
    </instancedMesh>
  );
}

function Cup() {
  return (
    <group>
      {/* medication cup, translucent */}
      <mesh position={[0, -0.55, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.32, 0.7, 32]} />
        <meshPhysicalMaterial color="#bcd9d3" transmission={0.5} thickness={0.4} roughness={0.2} metalness={0} />
      </mesh>
      {/* liquid pool */}
      <mesh position={[0, -0.82, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 32]} />
        <meshStandardMaterial color="#5cae8c" transparent opacity={0.6} />
      </mesh>
      {/* jet stem */}
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 0.3, 12]} />
        <meshStandardMaterial color="#c9cbcd" metalness={1} roughness={0.2} />
      </mesh>
      {/* mouthpiece stem */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.14, 0.22, 0.5, 24, 1, true]} />
        <meshPhysicalMaterial color="#dfe2e0" transmission={0.5} thickness={0.3} roughness={0.2} metalness={0} />
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
      <Cup />
      <Mist paused={paused} />
    </group>
  );
}

export default function Nebulizer3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.1, 5.2], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
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
