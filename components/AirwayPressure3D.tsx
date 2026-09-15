"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Vector2, type Group, type Mesh } from "three";

/**
 * The exact mechanism from "how CPAP machines work — pressure, not oxygen":
 * an unsupported airway narrows and collapses; positive pressure splints it
 * open. Two lathed tubes, one pinched at the waist, one held to a constant
 * bore, staged the same way as the O2 molecule and sieve-bed pieces — this
 * is the one other place in the catalog we can render an honest mechanism
 * in 3D without inventing a device we don't have real geometry for.
 */
function collapsedProfile() {
  return [
    [0.42, -1.3], [0.4, -0.9], [0.3, -0.5], [0.14, -0.15], [0.09, 0],
    [0.14, 0.15], [0.3, 0.5], [0.4, 0.9], [0.42, 1.3],
  ].map(([r, y]) => new Vector2(r, y));
}

function openProfile() {
  return [
    [0.4, -1.3], [0.39, -0.9], [0.37, -0.5], [0.36, -0.15], [0.36, 0],
    [0.36, 0.15], [0.37, 0.5], [0.39, 0.9], [0.4, 1.3],
  ].map(([r, y]) => new Vector2(r, y));
}

function AirwayTube({ x, collapsed, paused }: { x: number; collapsed: boolean; paused: boolean }) {
  const points = useMemo(() => (collapsed ? collapsedProfile() : openProfile()), [collapsed]);
  const ringRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (collapsed || !ringRef.current) return;
    const t = paused ? 0 : state.clock.elapsedTime;
    const pulse = paused ? 0.5 : (Math.sin(t * 1.8) + 1) / 2;
    ringRef.current.scale.setScalar(1 + pulse * 0.35);
    (ringRef.current.material as { opacity: number }).opacity = 0.5 - pulse * 0.35;
  });

  return (
    <group position={[x, 0, 0]}>
      <mesh castShadow>
        <latheGeometry args={[points, 48]} />
        <meshPhysicalMaterial
          color={collapsed ? "#8a9089" : "#5cae8c"}
          metalness={0.3}
          roughness={0.25}
          transmission={0.35}
          thickness={0.6}
          ior={1.3}
        />
      </mesh>
      {!collapsed && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.44, 0.5, 48]} />
          <meshBasicMaterial color="#a35a26" transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}

function Scene({ paused }: { paused: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const targetY = state.pointer.x * 0.3;
    const targetX = state.pointer.y * 0.12;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group}>
      <AirwayTube x={-0.95} collapsed paused={paused} />
      <AirwayTube x={0.95} collapsed={false} paused={paused} />
    </group>
  );
}

export default function AirwayPressure3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.2, 5], fov: 36 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 3, 4]} intensity={1.4} color="#fff3e2" castShadow />
      <directionalLight position={[-4, 1, -2]} intensity={0.7} color="#5cae8c" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2} color="#fff3e2" position={[3, 2, 3]} scale={[4, 3, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#5cae8c" position={[-3, -1, 2]} rotation={[0, Math.PI / 3, 0]} scale={[3, 3, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#e08a4d" position={[0, -2, -4]} scale={5} />
      </Environment>
      <Scene paused={paused} />
    </Canvas>
  );
}
