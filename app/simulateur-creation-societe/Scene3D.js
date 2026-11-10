"use client";

// Couloir 3D : la caméra avance de salle en salle (prop "salle").
// Installation : npm i three @react-three/fiber
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

const GOLD = "#d4ad5f";
const ESP = 9; // distance entre deux portes
const SALLES = 6; // 5 questions + porte finale

function Rig({ salle }) {
  const lum = useRef();
  useFrame((st, dt) => {
    const c = st.camera;
    const tz = 6 - salle * ESP;
    const reste = Math.abs(c.position.z - tz);
    c.position.z = MathUtils.damp(c.position.z, tz, 2.2, dt);
    c.position.x = MathUtils.damp(c.position.x, st.pointer.x * 0.5, 3, dt);
    c.position.y = 1.6 + st.pointer.y * 0.15 + Math.sin(st.clock.elapsedTime * 7) * 0.03 * Math.min(1, reste);
    c.lookAt(c.position.x * 0.3, 1.5, c.position.z - 8);
    if (lum.current) lum.current.position.set(0, 3, c.position.z - 2);
  });
  return <pointLight ref={lum} intensity={40} distance={22} color="#ffe2a8" />;
}

function Porte({ z, finale }) {
  const m = <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />;
  return (
    <group position={[0, 0, z]}>
      <mesh position={[-1.7, 1.7, 0]}><boxGeometry args={[0.3, 3.4, 0.4]} />{m}</mesh>
      <mesh position={[1.7, 1.7, 0]}><boxGeometry args={[0.3, 3.4, 0.4]} />{m}</mesh>
      <mesh position={[0, 3.5, 0]}><boxGeometry args={[3.7, 0.3, 0.4]} />{m}</mesh>
      {finale && (
        <mesh position={[0, 1.7, -0.1]}>
          <planeGeometry args={[3.2, 3.4]} />
          <meshStandardMaterial color="#fff3cf" emissive="#ffd98a" emissiveIntensity={2.2} />
        </mesh>
      )}
    </group>
  );
}

function Decor() {
  const cols = Array.from({ length: 20 }, (_, k) => -k * 3);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -25]}>
        <planeGeometry args={[14, 90]} />
        <meshStandardMaterial color="#2a0a0c" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -25]}>
        <planeGeometry args={[0.08, 90]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.6} />
      </mesh>
      {cols.map((z) => [-4.5, 4.5].map((x) => (
        <mesh key={`${x}${z}`} position={[x, 2.2, z]}>
          <cylinderGeometry args={[0.3, 0.36, 4.4, 16]} />
          <meshStandardMaterial color="#e9d8bd" metalness={0.2} roughness={0.5} />
        </mesh>
      )))}
      {Array.from({ length: SALLES }, (_, i) => <Porte key={i} z={-i * ESP} finale={i === SALLES - 1} />)}
    </>
  );
}

export default function Scene3D({ salle = 0 }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let gl = false;
    try { gl = !!document.createElement("canvas").getContext("webgl"); } catch {}
    setOk(!reduit && gl);
  }, []);

  if (!ok) return null;
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.6, 6], fov: 60 }} gl={{ powerPreference: "low-power" }}>
        <color attach="background" args={["#4a0f12"]} />
        <fog attach="fog" args={["#4a0f12", 8, 30]} />
        <ambientLight intensity={0.8} />
        <Rig salle={salle} />
        <Decor />
      </Canvas>
    </div>
  );
}