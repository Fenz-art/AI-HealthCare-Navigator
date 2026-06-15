"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Trail } from "@react-three/drei";
import * as THREE from "three";

// Simplex noise helper
function simplexNoise2D(x: number, y: number): number {
  return Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.5 + Math.sin(x * 0.05 + y * 0.07) * 0.3;
}

/* ── Wireframe Globe ── */
function WireframeGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
      meshRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[3.2, 24]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#1a2332"
        wireframe
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ── Latitude Rings ── */
function LatitudeRings() {
  const groupRef = useRef<THREE.Group>(null);
  const rings = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      lat: ((i - 3.5) / 4) * Math.PI * 0.6,
      speed: 0.3 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.02;
    rings.forEach((ring, i) => {
      const child = groupRef.current!.children[i];
      if (child) child.rotation.z += delta * ring.speed;
    });
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => {
        const radius = 3.2 * Math.cos(ring.lat);
        const y = 3.2 * Math.sin(ring.lat);
        return (
          <group key={i} position={[0, y, 0]} rotation={[0, ring.offset, 0]}>
            {/* Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[radius - 0.01, radius + 0.01, 64]} />
              <meshBasicMaterial
                color="#C57B65"
                transparent
                opacity={0.15}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Traveling dot */}
            <TravelingDot radius={radius} speed={ring.speed * 2} />
          </group>
        );
      })}
    </group>
  );
}

/* ── Traveling Dot ── */
function TravelingDot({ radius, speed }: { radius: number; speed: number }) {
  const dotRef = useRef<THREE.Mesh>(null);
  const progress = useRef(0);

  useFrame((_, delta) => {
    if (!dotRef.current) return;
    progress.current += delta * speed;
    dotRef.current.position.x = radius * Math.cos(progress.current);
    dotRef.current.position.z = radius * Math.sin(progress.current);
  });

  return (
    <mesh ref={dotRef}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshBasicMaterial color="#C57B65" />
    </mesh>
  );
}

/* ── Glowing Dots (Provider Locations) ── */
function ProviderDots() {
  const dots = useMemo(() => {
    // Major cities around the globe
    const cities = [
      { lat: 35.6762, lng: 139.6503 }, // Tokyo
      { lat: 51.5074, lng: -0.1278 }, // London
      { lat: 40.7128, lng: -74.006 }, // New York
      { lat: -33.8688, lng: 151.2093 }, // Sydney
      { lat: 13.7563, lng: 100.5018 }, // Bangkok
      { lat: 48.8566, lng: 2.3522 }, // Paris
      { lat: 55.7558, lng: 37.6173 }, // Moscow
      { lat: -23.5505, lng: -46.6333 }, // Sao Paulo
      { lat: 1.3521, lng: 103.8198 }, // Singapore
      { lat: 37.5665, lng: 126.978 }, // Seoul
    ];
    return cities.map((c) => {
      const phi = (90 - c.lat) * (Math.PI / 180);
      const theta = (c.lng + 180) * (Math.PI / 180);
      return {
        x: 3.3 * Math.sin(phi) * Math.cos(theta),
        y: 3.3 * Math.cos(phi),
        z: 3.3 * Math.sin(phi) * Math.sin(theta),
      };
    });
  }, []);

  return (
    <>
      {dots.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#C57B65" transparent opacity={0.8} />
        </mesh>
      ))}
    </>
  );
}

/* ── Inner Glow Sphere ── */
function InnerGlow() {
  return (
    <mesh>
      <sphereGeometry args={[3.15, 32, 32]} />
      <meshBasicMaterial
        color="#C57B65"
        transparent
        opacity={0.03}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

/* ── Starfield ── */
function Starfield() {
  const stars = useMemo(() => {
    const positions = new Float32Array(600);
    for (let i = 0; i < 200; i++) {
      const r = 15 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[stars, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#8896AB" size={0.05} transparent opacity={0.4} />
    </points>
  );
}

/* ── Main Globe Canvas ── */
export function GlobeCanvas() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <WireframeGlobe />
          <InnerGlow />
          <LatitudeRings />
          <ProviderDots />
          <Starfield />
        </Suspense>
      </Canvas>
    </div>
  );
}
