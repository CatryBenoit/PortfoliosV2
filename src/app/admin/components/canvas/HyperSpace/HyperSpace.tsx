"use client";
import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function HyperSpace({ isJumping }: { isJumping: boolean }) {
  const groupRef = useRef<THREE.Group>(null); 
  
  const tunnelRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const texture = useLoader(THREE.TextureLoader, "/textures/HyperSpace/tunnel.jpg");

  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
  }, [texture]);

  const currentSpeed = useRef(0.2);
  const currentStretch = useRef(4);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.copy(state.camera.position);
      groupRef.current.quaternion.copy(state.camera.quaternion);
    }

    const targetSpeed = isJumping ? 10.0 : 0.2;
    const targetStretch = isJumping ? 0.5 : 4.0;
    const targetOpacity = isJumping ? 0.8 : 0.0; 

    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed, delta * 3);
    currentStretch.current = THREE.MathUtils.lerp(currentStretch.current, targetStretch, delta * 3);

    texture.offset.y -= delta * currentSpeed.current;
    texture.repeat.set(4, currentStretch.current);

    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, delta * 5);
      
      if (tunnelRef.current) {
        tunnelRef.current.visible = materialRef.current.opacity > 0.01;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={tunnelRef} rotation={[Math.PI / 2, Math.PI / 4, 0]} visible={false}>
              <cylinderGeometry args={[1, 15, 10000, 16, 1, true]} />
        <meshBasicMaterial 
          ref={materialRef} 
          map={texture} 
          side={THREE.BackSide}
          transparent
          opacity={0} 
          fog={false}
        />
      </mesh>
    </group>
  );
}