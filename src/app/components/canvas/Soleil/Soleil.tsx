"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Soleil() {
  const sunRef = useRef<THREE.Mesh>(null);

  const texture = useTexture("/textures/Sun/2k_sun.jpg");

  const { tint, halo1, halo2, light } = useMemo(() => {
    const starProfiles = [
      { tint: new THREE.Color(1.5, 1.5, 1.2), halo1: "#eab308", halo2: "#ca8a04", light: "#fef08a" },
      { tint: new THREE.Color(1.0, 1.4, 2.0), halo1: "#38bdf8", halo2: "#0284c7", light: "#bae6fd" },
      { tint: new THREE.Color(2.0, 1.2, 1.0), halo1: "#ef4444", halo2: "#b91c1c", light: "#fca5a5" },
      { tint: new THREE.Color(1.6, 1.4, 2.0), halo1: "#d8b4fe", halo2: "#9333ea", light: "#e9d5ff" },
    ];
    return starProfiles[Math.floor(Math.random() * starProfiles.length)];
  }, []); 

  useFrame((_, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      <pointLight intensity={300} distance={500} decay={1.5} color={light} />
      
      <mesh ref={sunRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial 
          map={texture} 
          color={tint} 
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshBasicMaterial 
          color={halo1} 
          transparent 
          opacity={0.1} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[3.5, 64, 64]} />
        <meshBasicMaterial 
          color={halo2} 
          transparent 
          opacity={0.001} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>
    </group>
  );
}