"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { CatmullRomCurve3, TubeGeometry, Vector3, type Group } from "three";

/**
 * AHI, made physical: a breathing-effort line with real gaps where airflow
 * drops out (an apnea/hypopnea event), next to the same line once therapy
 * holds the airway open — regular, no gaps. Same paired-tube contrast
 * language as the airway-collapse piece, but along time instead of a
 * cross-section, which is what the AHI number actually measures.
 */
const POINTS = 60;
const LENGTH = 5.2;

function untreatedProfile() {
  const pts: Vector3[] = [];
  for (let i = 0; i <= POINTS; i++) {
    const x = (i / POINTS) * LENGTH - LENGTH / 2;
    const cyclePos = (i / POINTS) * 5;
    const inEvent = cyclePos % 1.6 < 0.35;
    const amp = inEvent ? 0.03 : 0.32;
    const y = Math.sin(cyclePos * Math.PI * 2) * amp;
    pts.push(new Vector3(x, y, 0));
  }
  return pts;
}

function treatedProfile() {
  const pts: Vector3[] = [];
  for (let i = 0; i <= POINTS; i++) {
    const x = (i / POINTS) * LENGTH - LENGTH / 2;
    const cyclePos = (i / POINTS) * 5;
    const y = Math.sin(cyclePos * Math.PI * 2) * 0.3;
    pts.push(new Vector3(x, y, 0));
  }
  return pts;
}

function Ribbon({ y, treated }: { y: number; treated: boolean }) {
  const geometry = useMemo(() => {
    const points = treated ? treatedProfile() : untreatedProfile();
    const curve = new CatmullRomCurve3(points);
    return new TubeGeometry(curve, 200, 0.055, 12, false);
  }, [treated]);

  return (
    <mesh geometry={geometry} position={[0, y, 0]} castShadow>
      <meshStandardMaterial
        color={treated ? "#5cae8c" : "#8a9089"}
        metalness={0.4}
        roughness={0.25}
        emissive={treated ? "#5cae8c" : "#000000"}
        emissiveIntensity={treated ? 0.15 : 0}
      />
    </mesh>
  );
}

function Scene({ paused: _paused }: { paused: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const targetY = state.pointer.x * 0.2;
    const targetX = state.pointer.y * 0.12;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group}>
      <Ribbon y={0.7} treated={false} />
      <Ribbon y={-0.7} treated />
    </group>
  );
}

export default function AHITimeline3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.2, 5.6], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 3, 4]} intensity={1.4} color="#fff3e2" castShadow />
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
