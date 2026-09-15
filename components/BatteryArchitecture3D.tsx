"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { InstancedMesh, Object3D, type Group, type MeshStandardMaterial } from "three";

/**
 * Why an "8-cell" and a "16-cell" pack aren't just a bigger box: they're
 * literally more of the same lithium-ion cell, wired in parallel groups on
 * a shared bus bar. A 4x4 grid — the cell count in the largest pack this
 * page actually sells — with a charge wave sweeping across it row by row
 * is the honest way to show capacity scaling by cell count, not a sealed
 * black-box battery icon.
 */
const ROWS = 4;
const COLS = 4;
const COUNT = ROWS * COLS;
const SPACING = 0.62;

function Pack({ paused }: { paused: boolean }) {
  const cellsRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  const positions = useMemo(() => {
    const pts: [number, number][] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        pts.push([(c - (COLS - 1) / 2) * SPACING, (r - (ROWS - 1) / 2) * SPACING]);
      }
    }
    return pts;
  }, []);

  useEffect(() => {
    if (!cellsRef.current) return;
    positions.forEach(([x, y], i) => {
      dummy.position.set(x, y, 0);
      dummy.rotation.set(Math.PI / 2, 0, 0);
      dummy.updateMatrix();
      cellsRef.current!.setMatrixAt(i, dummy.matrix);
    });
    cellsRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, dummy]);

  useFrame((state) => {
    if (!cellsRef.current) return;
    const t = paused ? 0 : state.clock.elapsedTime;
    const mat = cellsRef.current.material as MeshStandardMaterial;
    const wave = paused ? 0.5 : (Math.sin(t * 0.9) + 1) / 2;
    mat.emissiveIntensity = 0.25 + wave * 0.5;
  });

  return (
    <group>
      <instancedMesh ref={cellsRef} args={[undefined, undefined, COUNT]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.16, 24]} />
        <meshStandardMaterial color="#c9cbcd" metalness={1} roughness={0.25} emissive="#5cae8c" emissiveIntensity={0.3} />
      </instancedMesh>
      {/* bus bars connecting each row */}
      {Array.from({ length: ROWS }).map((_, r) => (
        <mesh key={r} position={[0, (r - (ROWS - 1) / 2) * SPACING, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[SPACING * (COLS - 1) + 0.3, 0.06, 0.02]} />
          <meshStandardMaterial color="#d4a256" metalness={1} roughness={0.2} emissive="#a35a26" emissiveIntensity={0.2} />
        </mesh>
      ))}
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
    <group ref={group} rotation={[0.15, 0, 0]}>
      <Pack paused={paused} />
    </group>
  );
}

export default function BatteryArchitecture3D({ paused = false }: { paused?: boolean }) {
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
