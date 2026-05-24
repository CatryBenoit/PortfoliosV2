"use client";
import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls,useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { supabase } from "./lib/supabase";
import HUD from "./components/layout/HUD";
import Soleil from "./components/canvas/Soleil/Soleil";
import Planete from "./components/canvas/Planet/Planet"; 
import HyperSpace from "./components/canvas/HyperSpace/HyperSpace";

type SystemKey = "PRO" | "PERSO" | "SCOLAIRE";

function CameraRig({ activeProject, controlsRef }: { activeProject: any, controlsRef: any }) {
  useFrame((state) => {
    if (!controlsRef.current) return;

    if (activeProject) {
      const planetObj = state.scene.getObjectByName(`planet-${activeProject.id}`);
      if (planetObj) {
        const pPos = planetObj.position;
        
        state.camera.position.lerp(
          new THREE.Vector3(pPos.x + 4, pPos.y + 1.5, pPos.z + 8), 
          0.05
        );
        
        controlsRef.current.target.lerp(
          new THREE.Vector3(pPos.x + 4, pPos.y, pPos.z), 
          0.05
        );
      }
    } else {
      // Retour au centre du système solaire
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
    }
  });
  return null;
}

function VoieLactee() {
  const bgRef = useRef<THREE.Mesh>(null);
  const texture = useTexture("/textures/Star/8k_stars_milky_way.jpg");

  useFrame((_, delta) => {
    if (bgRef.current) {
      bgRef.current.rotation.y -= delta * 0.005;
      bgRef.current.rotation.z -= delta * 0.002;
    }
  });

  return (
    <mesh ref={bgRef}>
      <sphereGeometry args={[1000, 64, 64]} />
      
      <meshBasicMaterial 
        map={texture} 
        side={THREE.BackSide} 
        fog={false} 
        transparent
        opacity={1} 
      />
    </mesh>
  );
}

export default function Home() {
  const [currentSystem, setCurrentSystem] = useState<SystemKey>("PRO");
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [allProjects, setAllProjects] = useState<any[]>([]);
  
  const [uniqueTechs, setUniqueTechs] = useState<string[]>([]);
  const [selectedTech, setSelectedTech] = useState<string>("ALL");

  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const loadPlanets = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("projects").select("*");
      
      if (error) {
        console.error("Erreur de liaison de données :", error);
      } else if (data) {
        const formatted = data.map((p) => ({
          ...p,
          pos: [p.pos_x, p.pos_y, p.pos_z] as [number, number, number],
        }));
        setAllProjects(formatted);

        const techSet = new Set<string>();
        data.forEach(p => {
          if (p.tech) {
            const splitTechs = p.tech.split(/[\/,]/).map((t: string) => t.trim()).filter((t: string) => t.length > 0);
            splitTechs.forEach((t: string) => techSet.add(t));
          }
        });
        
        setUniqueTechs(Array.from(techSet).sort());
      }
      setLoading(false);
    };

    loadPlanets();
  }, []);

  const currentPlanets = allProjects.filter((p) => {
    if (selectedTech !== "ALL") {
      return p.tech.toLowerCase().includes(selectedTech.toLowerCase());
    }
    return p.system === currentSystem;
  });

  const handleTechChange = (tech: string) => {
    if (tech === selectedTech || isJumping) return;
    
    setIsJumping(true);
    setActiveProject(null);

    setTimeout(() => {
      setSelectedTech(tech);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
      }
    }, 500);

    setTimeout(() => {
      setIsJumping(false);
    }, 1200);
  };

  const changeSystem = (system: SystemKey) => {
    if (system === currentSystem || isJumping) return;

    setIsJumping(true);
    setActiveProject(null);

    setTimeout(() => {
      setCurrentSystem(system);
      setSelectedTech("ALL"); 
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
      }
    }, 500);

    setTimeout(() => {
      setIsJumping(false);
    }, 1200);
  };

  const nextProject = () => {
    if (!activeProject || currentPlanets.length === 0) return;
    const idx = currentPlanets.findIndex(p => p.id === activeProject.id);
    setActiveProject(currentPlanets[(idx + 1) % currentPlanets.length]);
  };

  const prevProject = () => {
    if (!activeProject || currentPlanets.length === 0) return;
    const idx = currentPlanets.findIndex(p => p.id === activeProject.id);
    setActiveProject(currentPlanets[(idx - 1 + currentPlanets.length) % currentPlanets.length]);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#010103] flex flex-col items-center justify-center font-mono text-cyan-400 z-50">
        <div className="scanline z-50" />
        <div className="text-xl font-bold tracking-[0.4em] animate-pulse uppercase mb-2">&gt; Sync_Database_Uplink...</div>
        <div className="text-[10px] text-white/50 tracking-widest uppercase">Téléchargement de la carte stellaire</div>
      </div>
    );
  }

  return (
    <main className="fixed inset-0 w-screen h-screen bg-[#010103] overflow-hidden">
      
      <div className={`fixed inset-0 z-40 bg-cyan-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay ${isJumping ? "opacity-20" : "opacity-0"}`} />

      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Canvas camera={{ position: [0, 8, 20], fov: 45, far: 15000 }} onPointerMissed={() => setActiveProject(null)} style={{ width: '100%', height: '100%' }}>
          <OrbitControls ref={controlsRef} makeDefault enablePan={false} minDistance={8} maxDistance={40} enabled={!activeProject && !isJumping} />

          <ambientLight intensity={0.2} />
          <fog attach="fog" args={["#010103", 50, 800]} />
          
          <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={isJumping ? 25 : 1.5} />

          <CameraRig activeProject={activeProject} controlsRef={controlsRef} />
          
          <Suspense fallback={null}>
            <HyperSpace isJumping={isJumping} />
          </Suspense>

          {!isJumping && (
            <Suspense fallback={null}>
              <VoieLactee />
              <Soleil />
              {currentPlanets.map((project) => (
                <Planete key={project.id} project={project} isActive={activeProject?.id === project.id} onClick={() => setActiveProject(project)} />
              ))}
            </Suspense>
          )}

          <EffectComposer>
            <Bloom mipmapBlur luminanceThreshold={0.8} intensity={1.5} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* HUD  */}
      <HUD 
        activeProject={activeProject} 
        onClose={() => setActiveProject(null)} 
        onNext={nextProject} 
        onPrev={prevProject} 
        currentSystem={currentSystem} 
        onChangeSystem={changeSystem} 
        uniqueTechs={uniqueTechs}
        selectedTech={selectedTech}
        onSelectTech={handleTechChange}
      />
    </main>
  );

}