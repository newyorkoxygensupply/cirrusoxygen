"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import { Quaternion, Vector3, type Group } from "three";

/**
 * The material itself: a single unit cell of the crystalline lattice that
 * does the actual sieving — simplified to a cube of eight lattice points
 * (the standard, honest way materials science illustrates a crystal
 * structure) rather than a fabricated, precise zeolite model we have no
 * reference for. Same chrome/gold material pair as the O2 molecule beside
 * it, so the two read as one "materials" collection, not two styles.
 */
const S = 0.85;
const CORNERS = [-S, S].flatMap((x) => [-S, S].flatMap((y) => [-S, S].map((z) => new Vector3(x, y, z))));

function buildEdges() {
  const edges: { position: Vector3; quaternion: Quaternion; length: number }[] = [];
  for (let i = 0; i < CORNERS.length; i++) {
    for (let j = i + 1; j < CORNERS.length; j++) {
      const a = CORNERS[i];
      const b = CORNERS[j];
      const diffAxes = ["x", "y", "z"].filter((axis) => Math.abs(a[axis as "x"] - b[axis as "x"]) > 0.01);
      if (diffAxes.length !== 1) continue; // only true cube edges, not face/space diagonals
      const direction = new Vector3().subVectors(b, a).normalize();
      const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction);
      const position = new Vector3().addVectors(a, b).multiplyScalar(0.5);
      edges.push({ position, quaternion, length: a.distanceTo(b) });
    }
  }
  return edges;
}

function Lattice({ paused }: { paused: boolean }) {
  const group = useRef<Group>(null);
  const edges = useMemo(() => buildEdges(), []);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!paused) group.current.rotation.y += delta * 0.16;
    const targetX = state.pointer.y * 0.2;
    const targetZ = -state.pointer.x * 0.2;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.04;
  });

  return (
    <group ref={group}>
      <Float speed={paused ? 0 : 1.2} rotationIntensity={0} floatIntensity={paused ? 0 : 0.4}>
        {CORNERS.map((c, i) => (
          <mesh key={i} position={c} castShadow>
            <sphereGeometry args={[0.22, 32, 32]} />
            <meshStandardMaterial color="#e9eaec" metalness={1} roughness={0.18} />
          </mesh>
        ))}
        {edges.map((e, i) => (
          <mesh key={i} position={e.position} quaternion={e.quaternion} castShadow>
            <cylinderGeometry args={[0.035, 0.035, e.length, 16]} />
            <meshStandardMaterial color="#d4a256" metalness={1} roughness={0.14} emissive="#a35a26" emissiveIntensity={0.12} />
          </mesh>
        ))}
      </Float>
    </group>
  );
}

export default function SieveLattice3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.4, 5.2], fov: 36 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 3, 4]} intensity={1.6} color="#fff3e2" castShadow />
      <directionalLight position={[-4, 1, -2]} intensity={0.7} color="#5cae8c" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.2} color="#fff3e2" position={[3, 2, 3]} scale={[4, 3, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#5cae8c" position={[-3, -1, 2]} rotation={[0, Math.PI / 3, 0]} scale={[3, 3, 1]} />
        <Lightformer form="ring" intensity={1.4} color="#e08a4d" position={[0, -2, -4]} scale={5} />
      </Environment>
      <Lattice paused={paused} />
    </Canvas>
  );
}
