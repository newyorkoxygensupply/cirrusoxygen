"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { InstancedMesh, Object3D, type Group, type Mesh, type MeshStandardMaterial } from "three";

/**
 * The real distinction from "pulse dose vs. continuous flow oxygen": a
 * portable concentrator doesn't run a steady stream — a breath sensor
 * detects the start of inhalation and fires a single metered bolus, then
 * waits. Rendered as a valve that senses, then fires a bolus that travels
 * outward as a group, with a pause before the next breath — never a
 * continuous trickle, because that would misrepresent how these machines
 * actually work.
 */
const PARTICLES = 7;
const CYCLE = 2.4;

function Valve({ paused }: { paused: boolean }) {
  const sensorRef = useRef<Mesh>(null);
  const particlesRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const offsets = useMemo(
    () => Array.from({ length: PARTICLES }, () => (Math.random() - 0.5) * 0.5),
    []
  );

  useFrame((state) => {
    const t = paused ? 0 : state.clock.elapsedTime;
    const cycleT = (t % CYCLE) / CYCLE;

    // sensing glow: brightens just before the bolus fires
    if (sensorRef.current) {
      const sense = cycleT < 0.18 ? Math.sin((cycleT / 0.18) * Math.PI) : 0;
      const mat = sensorRef.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + sense * 1.2;
      mat.opacity = 0.4 + sense * 0.5;
    }

    // bolus: fires together at cycleT=0.2, travels outward, fades by 1.0
    if (particlesRef.current) {
      const fireStart = 0.2;
      const travel = cycleT < fireStart ? 0 : (cycleT - fireStart) / (1 - fireStart);
      offsets.forEach((offset, i) => {
        const y = travel * 1.9;
        dummy.position.set(offset * (0.3 + travel * 0.4), 0.5 + y, offset * (0.3 + travel * 0.4));
        const scale = travel < 0.02 ? 0 : 0.08 * (1 - travel * 0.4);
        dummy.scale.setScalar(Math.max(scale, 0));
        dummy.updateMatrix();
        particlesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.55, 1, 48]} />
        <meshStandardMaterial color="#c9cbcd" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 0.35, 32]} />
        <meshStandardMaterial color="#8a9089" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh ref={sensorRef} position={[0, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.24, 32]} />
        <meshStandardMaterial color="#d4a256" emissive="#a35a26" transparent opacity={0.5} />
      </mesh>
      <instancedMesh ref={particlesRef} args={[undefined, undefined, PARTICLES]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#5cae8c" emissive="#5cae8c" emissiveIntensity={0.9} metalness={0.2} roughness={0.3} />
      </instancedMesh>
    </group>
  );
}

function Scene({ paused }: { paused: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!paused) group.current.rotation.y += delta * 0.15;
    const targetX = state.pointer.y * 0.15;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      <Valve paused={paused} />
    </group>
  );
}

export default function PulseDose3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.3, 4.6], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
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
