"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";

const TEXTURE_PATHS = [
  "/textures/Planet/2k_ceres_fictional.jpg",
  "/textures/Planet/2k_eris_fictional.jpg",
  "/textures/Planet/2k_haumea_fictional.jpg",
  "/textures/Planet/2k_jupiter.jpg",
  "/textures/Planet/2k_makemake_fictional.jpg",
  "/textures/Planet/2k_mars.jpg",
  "/textures/Planet/2k_mercury.jpg",
  "/textures/Planet/2k_neptune.jpg",
  "/textures/Planet/2k_saturn.jpg",
  "/textures/Planet/2k_uranus.jpg",
  "/textures/Planet/2k_venus_atmosphere.jpg",
  "/textures/Planet/2k_venus_surface.jpg"
];

const TEXTURE_PATHS_MOON = [
  "/textures/Moons/Moon1.png",
  "/textures/Moons/Moon2.png"
];

export default function Planete({ project, isActive, onClick }: any) {
  const planetRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const moonRef = useRef<THREE.Mesh>(null);
  
  const moonConfig = useMemo(() => {
    const hasMoon = Math.random() > 0.7;
    if (!hasMoon) return null;

    return {
      size: 0.1 + Math.random() * 0.2,     
      distance: 2.2 + Math.random() * 1.5,   // Distance par rapport à la planète
      speed: (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random()), // Vitesse et sens de rotation
      color: new THREE.Color().setHSL(0, 0, 0.3 + Math.random() * 0.4), // Nuance de gris aléatoire
      startAngle: Math.random() * Math.PI * 2
    };
  }, []);

  const currentMoonAngle = useRef(moonConfig?.startAngle || 0);

  const randomTexturePath = useMemo(() => {
    return TEXTURE_PATHS[Math.floor(Math.random() * TEXTURE_PATHS.length)];
  }, []);

    const randomTexturePathMoon = useMemo(() => {
    return TEXTURE_PATHS[Math.floor(Math.random() * TEXTURE_PATHS_MOON.length)];
  }, []);

  const texture = useTexture(randomTexturePath);
  const textureMoon = useTexture(randomTexturePathMoon);

  const variedColor = useMemo(() => {
    const baseColor = new THREE.Color(project.color);
    const hsl = { h: 0, s: 0, l: 0 };
    baseColor.getHSL(hsl);
    hsl.l = THREE.MathUtils.clamp(hsl.l + (Math.random() * 0.2 - 0.1), 0, 1);
    hsl.h = (hsl.h + (Math.random() * 0.05 - 0.025)) % 1;
    return new THREE.Color().setHSL(hsl.h, hsl.s, hsl.l);
  }, [project.color]);

  const angleInitial = useMemo(() => Math.atan2(project.pos[2], project.pos[0]), [project.pos]);
  const rayonOrbite = useMemo(() => Math.sqrt(project.pos[0] ** 2 + project.pos[2] ** 2), [project.pos]);
  
  const vitesseOrbite = 0.5 / rayonOrbite; 
  const currentAngle = useRef(angleInitial);

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.5;
    }

    if (groupRef.current && !isActive) {
      currentAngle.current += delta * vitesseOrbite;
      groupRef.current.position.x = Math.cos(currentAngle.current) * rayonOrbite;
      groupRef.current.position.z = Math.sin(currentAngle.current) * rayonOrbite;
      groupRef.current.position.y = project.pos[1]; 
    }

    if (moonRef.current && moonConfig) {
      currentMoonAngle.current += delta * moonConfig.speed;
      moonRef.current.position.x = Math.cos(currentMoonAngle.current) * moonConfig.distance;
      moonRef.current.position.z = Math.sin(currentMoonAngle.current) * moonConfig.distance;
      moonRef.current.rotation.y += delta * 0.2; 
    }
  });

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, project.pos[1], 0]}>
        <ringGeometry args={[rayonOrbite - 0.02, rayonOrbite + 0.02, 64]} />
        <meshBasicMaterial color={variedColor} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      <group 
        ref={groupRef} 
        name={`planet-${project.id}`}
        position={[
          Math.cos(angleInitial) * rayonOrbite, 
          project.pos[1], 
          Math.sin(angleInitial) * rayonOrbite
        ]} 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        
        <mesh ref={planetRef}>
          <sphereGeometry args={[isActive ? 1.5 : 1, 32, 32]} />
          <meshStandardMaterial 
            map={texture}
            color={variedColor} 
            roughness={0.8} 
            metalness={0.1} 
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[isActive ? 1.6 : 1.15, 32, 32]} />
          <meshBasicMaterial 
            color={variedColor} 
            transparent 
            opacity={0.002} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>

        {moonConfig && (
          <>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[moonConfig.distance - 0.01, moonConfig.distance + 0.01, 32]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
            </mesh>
            
            <mesh ref={moonRef}>
              <sphereGeometry args={[moonConfig.size, 16, 16]} />
              <meshStandardMaterial 
                map={textureMoon}
                color={moonConfig.color} 
                roughness={0.9} 
                metalness={0} 
              />
            </mesh>
          </>
        )}

        {!isActive && (
          <Html position={[0, 1.8, 0]} center distanceFactor={15}>
            <div className="text-[10px] text-white font-mono uppercase tracking-widest bg-black/60 px-2 py-1 rounded border border-white/20 whitespace-nowrap shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              {project.name}
            </div>
          </Html>
        )}
      </group>
    </>
  );
}