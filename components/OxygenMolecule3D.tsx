"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import { Quaternion, Vector3, type Group } from "three";

// Atoms sit on a diagonal, not a pure horizontal line: world-Y rotation never
// changes their Y coordinate, so the two spheres stay vertically separated
// at every angle of the auto-rotate — a purely horizontal pair would go
// edge-on (one atom hiding the other) twice per revolution.
const ATOM_A = new Vector3(-1.0, -0.45, 0);
const ATOM_B = new Vector3(1.0, 0.45, 0);
const ATOM_RADIUS = 0.85;

/**
 * O2 rendered as a piece of jewelry, not a textbook diagram: two platinum
 * atoms joined by a single brushed-gold bond, lit like a product shot on a
 * dark stage. It's deliberately abstract rather than any specific device —
 * this is the one component of the entire catalog we can render honestly in
 * 3D, because it's the molecule, not a product we'd otherwise have to fake.
 */
function Molecule({ paused }: { paused: boolean }) {
  const group = useRef<Group>(null);

  const bond = useMemo(() => {
    const direction = new Vector3().subVectors(ATOM_B, ATOM_A).normalize();
    const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction);
    const position = new Vector3().addVectors(ATOM_A, ATOM_B).multiplyScalar(0.5);
    const length = ATOM_A.distanceTo(ATOM_B) - ATOM_RADIUS * 0.9;
    return { quaternion, position, length };
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!paused) {
      group.current.rotation.y += delta * 0.22;
    }
    const targetX = state.pointer.y * 0.25;
    const targetZ = -state.pointer.x * 0.25;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.04;
  });

  return (
    <group ref={group}>
      <Float speed={paused ? 0 : 1.4} rotationIntensity={0} floatIntensity={paused ? 0 : 0.5}>
        <mesh position={ATOM_A} castShadow>
          <sphereGeometry args={[ATOM_RADIUS, 64, 64]} />
          <meshStandardMaterial color="#e9eaec" metalness={1} roughness={0.18} />
        </mesh>
        <mesh position={ATOM_B} castShadow>
          <sphereGeometry args={[ATOM_RADIUS, 64, 64]} />
          <meshStandardMaterial color="#e9eaec" metalness={1} roughness={0.18} />
        </mesh>
        <mesh position={bond.position} quaternion={bond.quaternion} castShadow>
          <cylinderGeometry args={[0.13, 0.13, bond.length, 32]} />
          <meshStandardMaterial color="#d4a256" metalness={1} roughness={0.12} emissive="#a35a26" emissiveIntensity={0.15} />
        </mesh>
      </Float>
    </group>
  );
}

export default function OxygenMolecule3D({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 4.6], fov: 38 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 3, 4]} intensity={1.6} color="#fff3e2" castShadow />
      <directionalLight position={[-4, 1, -2]} intensity={0.7} color="#5cae8c" />
      <directionalLight position={[0, -2, -3]} intensity={0.5} color="#e08a4d" />
      {/* Procedural studio softbox rig — built from local Lightformer
          primitives rather than a fetched HDRI, so the CSP's connect-src
          'self' never has to be loosened for a decorative reflection map. */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.2} color="#fff3e2" position={[3, 2, 3]} scale={[4, 3, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#5cae8c" position={[-3, -1, 2]} rotation={[0, Math.PI / 3, 0]} scale={[3, 3, 1]} />
        <Lightformer form="ring" intensity={1.4} color="#e08a4d" position={[0, -2, -4]} scale={5} />
      </Environment>
      <Molecule paused={paused} />
    </Canvas>
  );
}
