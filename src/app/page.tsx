"use client";
import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Filter, MousePointerClick, Radar, Satellite, X } from "lucide-react";
import * as THREE from "three";

import { getProjects } from "@/app/actions";

import HUD from "./admin/components/layout/HUD";
import Soleil from "./admin/components/canvas/Soleil/Soleil";
import Planete from "./admin/components/canvas/Planet/Planet"; 
import HyperSpace from "./admin/components/canvas/HyperSpace/HyperSpace";

type SystemKey = "PRO" | "PERSO" | "SCOLAIRE";

// Écarte les planètes dont les orbites (rayon + angle) les placent trop près
// les unes des autres, pour éviter qu'elles ne se chevauchent visuellement.
// On ne touche qu'à l'angle (jamais au rayon) pour garder les anneaux d'orbite
// intacts, et le résultat est déterministe (aucun aléatoire) pour ne pas
// "sauter" d'une position à l'autre à chaque rendu.
function spreadPlanets<T extends { pos: [number, number, number] }>(planets: T[]): T[] {
  const MIN_DISTANCE = 3.5;
  const ANGLE_STEP = 0.5;
  const MAX_ATTEMPTS = 24;

  const polar = planets.map((p) => ({
    ref: p,
    radius: Math.sqrt(p.pos[0] ** 2 + p.pos[2] ** 2),
    angle: Math.atan2(p.pos[2], p.pos[0]),
  }));

  for (let i = 1; i < polar.length; i++) {
    const current = polar[i];
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const x = Math.cos(current.angle) * current.radius;
      const z = Math.sin(current.angle) * current.radius;

      const hasConflict = polar.slice(0, i).some((other) => {
        const ox = Math.cos(other.angle) * other.radius;
        const oz = Math.sin(other.angle) * other.radius;
        return Math.hypot(x - ox, z - oz) < MIN_DISTANCE;
      });

      if (!hasConflict) break;
      current.angle += ANGLE_STEP;
    }
  }

  return polar.map(({ ref, radius, angle }) => ({
    ...ref,
    pos: [Math.cos(angle) * radius, ref.pos[1], Math.sin(angle) * radius] as [number, number, number],
  }));
}

// Décalage caméra utilisé pour cadrer une planète sélectionnée.
const CAMERA_RADIAL_PULLBACK = 9; // recule la caméra vers l'extérieur de l'orbite (jamais côté étoile)
const CAMERA_TANGENT_OFFSET = 3.5; // léger décalage latéral pour un angle 3/4
const CAMERA_HEIGHT_OFFSET = 3; // hauteur au-dessus du plan orbital
const CAMERA_SCREEN_SHIFT = 2.6; // décale le point visé pour laisser la planète à gauche, place au pop-up à droite

const _planetTarget = new THREE.Vector3();
const _lookAtPoint = new THREE.Vector3();
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();

function CameraRig({ activeProject, controlsRef }: { activeProject: any; controlsRef: any }) {
  useFrame((state) => {
    if (!controlsRef.current) return;

    if (activeProject) {
      const planetObj = state.scene.getObjectByName(`planet-${activeProject.id}`);
      if (planetObj) {
        const pPos = planetObj.position;

        // Le décalage caméra était un vecteur fixe en coordonnées "monde"
        // (px+4, py+1.5, pz+8). Comme les planètes orbitent tout autour de
        // l'étoile, ce vecteur pointait parfois VERS l'étoile plutôt qu'à
        // l'opposé selon l'angle orbital du moment — la caméra pouvait alors
        // se retrouver derrière l'étoile ou une autre planète, avec un
        // cadrage complètement faux. On calcule maintenant le décalage par
        // rapport à la direction radiale de LA planète (étoile → planète),
        // pour toujours rester du bon côté, quel que soit son angle.
        let radialX = pPos.x;
        let radialZ = pPos.z;
        const radialLength = Math.hypot(radialX, radialZ) || 1;
        radialX /= radialLength;
        radialZ /= radialLength;
        // Perpendiculaire à la radiale, dans le plan orbital.
        const tangentX = -radialZ;
        const tangentZ = radialX;

        const desiredPos = new THREE.Vector3(
          pPos.x + radialX * CAMERA_RADIAL_PULLBACK + tangentX * CAMERA_TANGENT_OFFSET,
          pPos.y + CAMERA_HEIGHT_OFFSET,
          pPos.z + radialZ * CAMERA_RADIAL_PULLBACK + tangentZ * CAMERA_TANGENT_OFFSET
        );

        state.camera.position.lerp(desiredPos, 0.05);

        _planetTarget.set(pPos.x, pPos.y, pPos.z);
        // Le target d'OrbitControls reste la planète exacte (pour la reprise
        // en douceur des contrôles à la désélection) ; c'est uniquement
        // l'orientation RENDUE de la caméra qui est décalée juste en dessous.
        controlsRef.current.target.lerp(_planetTarget, 0.05);

        // OrbitControls réoriente lui-même la caméra vers `target` dans son
        // propre update(), exécuté avant ce useFrame. Comme target/position
        // bougent à chaque frame (planète en mouvement continu + lerp), sa
        // réorientation se base sur les valeurs de la frame PRÉCÉDENTE : la
        // caméra "regarde" toujours un peu en retard sur sa position réelle,
        // ce qui décentrait la planète (parfois à gauche, parfois à droite,
        // parfois carrément dépassée lors des transitions rapides). On force
        // ici l'orientation à être exactement synchronisée avec la position
        // et la cible de CETTE frame — et on en profite pour décaler le point
        // visé vers la droite de l'écran, ce qui pousse visuellement la
        // planète vers la gauche et laisse la place au panneau projet.
        // Réduit le décalage sur les écrans étroits/portrait (aspect < 1)
        // pour ne jamais pousser la planète hors du champ de vision.
        const aspect = state.size.width / state.size.height;
        const screenShift = CAMERA_SCREEN_SHIFT * Math.min(1, aspect);

        _forward.subVectors(_planetTarget, state.camera.position).normalize();
        _right.crossVectors(_forward, state.camera.up).normalize();
        _lookAtPoint.copy(_planetTarget).addScaledVector(_right, screenShift);
        state.camera.lookAt(_lookAtPoint);
      }
    } else {
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
      <meshBasicMaterial map={texture} side={THREE.BackSide} fog={false} transparent opacity={1} />
    </mesh>
  );
}

export default function Home() {
  const [currentSystem, setCurrentSystem] = useState<SystemKey>("PRO");
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [uniqueTechs, setUniqueTechs] = useState<string[]>([]);
  const [selectedTech, setSelectedTech] = useState<string>("ALL");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);

  const controlsRef = useRef<any>(null);

  // Préférences d'accessibilité : lues une fois au montage, puis persistées.
  useEffect(() => {
    try {
      setReducedMotion(localStorage.getItem("a11y_reducedMotion") === "1");
      setDyslexiaMode(localStorage.getItem("a11y_dyslexiaMode") === "1");
    } catch {
      // localStorage indisponible (navigation privée, etc.) : on garde les valeurs par défaut.
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dyslexia-mode", dyslexiaMode);
    try {
      localStorage.setItem("a11y_dyslexiaMode", dyslexiaMode ? "1" : "0");
    } catch {}
  }, [dyslexiaMode]);

  useEffect(() => {
    try {
      localStorage.setItem("a11y_reducedMotion", reducedMotion ? "1" : "0");
    } catch {}
  }, [reducedMotion]);

  useEffect(() => {
    const loadPlanets = async () => {
      setLoading(true);
      const { data, error } = await getProjects();
      
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

  const currentPlanets = useMemo(() => {
    const filtered = allProjects.filter((p) => {
      if (selectedTech !== "ALL") {
        return p.tech.toLowerCase().includes(selectedTech.toLowerCase());
      }
      return p.system === currentSystem;
    });
    return spreadPlanets(filtered);
  }, [allProjects, selectedTech, currentSystem]);

  const handleTechChange = (tech: string) => {
    if (tech === selectedTech || isJumping) return;
    setIsJumping(true);
    setActiveProject(null);
    setTimeout(() => {
      setSelectedTech(tech);
      if (controlsRef.current) controlsRef.current.target.set(0, 0, 0);
    }, 500);
    setTimeout(() => setIsJumping(false), 1200);
  };

  const changeSystem = (system: SystemKey) => {
    if (system === currentSystem || isJumping) return;
    setIsJumping(true);
    setActiveProject(null);
    setTimeout(() => {
      setCurrentSystem(system);
      setSelectedTech("ALL"); 
      if (controlsRef.current) controlsRef.current.target.set(0, 0, 0);
    }, 500);
    setTimeout(() => setIsJumping(false), 1200);
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

        {/* Radar de chargement : deux anneaux tournant en sens opposé autour d'un point pulsant */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/15" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin [animation-duration:1.6s]" />
          <div className="absolute inset-3 rounded-full border-2 border-cyan-500/10" />
          <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-cyan-300 animate-spin [animation-duration:1.1s] [animation-direction:reverse]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="absolute w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
          </div>
        </div>

        <div className="text-xl font-bold tracking-[0.4em] animate-pulse uppercase mb-2">&gt; Sync_Database_Uplink...</div>
        <div className="text-[10px] text-white/50 tracking-widest uppercase">Téléchargement de la carte stellaire</div>
      </div>
    );
  }

  return (
    <main className="fixed inset-0 w-screen h-screen bg-[#010103] overflow-hidden">
      {showIntro && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#070b14] border-2 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)] rounded-lg p-6 max-w-md w-full font-mono relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 animate-pulse" />

            <div className="flex items-center gap-3 mb-4 mt-1">
              <Radar className="text-cyan-400 animate-pulse shrink-0" size={28} />
              <div>
                <div className="text-[10px] text-cyan-400 tracking-[0.3em] uppercase font-bold">Briefing_Système</div>
                <h2 className="text-white font-bold text-lg uppercase tracking-widest">Guide de navigation</h2>
              </div>
            </div>

            <p className="text-cyan-100/70 text-sm leading-relaxed mb-5">
              Ce portfolio se pilote comme un poste de navigation spatial : chaque planète est un projet, chaque système solaire une catégorie.
            </p>

            <ul className="space-y-3 mb-6 text-xs text-cyan-100/80">
              <li className="flex items-start gap-3">
                <MousePointerClick size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <span><span className="text-white font-bold">Cliquez une planète</span> pour ouvrir le projet — la caméra la suit en orbite.</span>
              </li>
              <li className="flex items-start gap-3">
                <Satellite size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <span><span className="text-white font-bold">NAV_STATION</span> change de secteur : Pro, Perso, Scolaire.</span>
              </li>
              <li className="flex items-start gap-3">
                <Filter size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <span><span className="text-white font-bold">SCANNEUR</span> filtre les projets par technologie.</span>
              </li>
              <li className="flex items-start gap-3">
                <X size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>Cliquez <span className="text-white font-bold">en dehors</span> d&apos;un panneau pour le fermer.</span>
              </li>
            </ul>

            <div className="space-y-2 mb-6 border-t border-cyan-500/20 pt-4">
              <div className="text-[10px] text-cyan-400/70 tracking-[0.2em] uppercase font-bold mb-2">Accessibilité</div>

              <label className="flex items-center gap-3 text-xs text-cyan-100/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer shrink-0"
                />
                Mode épilepsie (désactive l&apos;effet hyperespace)
              </label>

              <label className="flex items-center gap-3 text-xs text-cyan-100/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dyslexiaMode}
                  onChange={(e) => setDyslexiaMode(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer shrink-0"
                />
                Mode dyslexie (police plus lisible)
              </label>
            </div>

            <button onClick={() => setShowIntro(false)} className="w-full py-3 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 uppercase tracking-widest text-sm transition-all duration-300 cursor-pointer">
              [ Entrer dans le système ]
            </button>
          </div>
        </div>
      )}
      
      <div className={`fixed inset-0 z-40 bg-cyan-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay ${isJumping && !reducedMotion ? "opacity-20" : "opacity-0"}`} />

      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Canvas camera={{ position: [0, 8, 20], fov: 45, far: 15000 }} onPointerMissed={() => setActiveProject(null)} style={{ width: "100%", height: "100%" }}>
          <OrbitControls ref={controlsRef} makeDefault enablePan={false} minDistance={8} maxDistance={40} enabled={!activeProject && !isJumping} />
          <ambientLight intensity={0.2} />
          <fog attach="fog" args={["#010103", 50, 800]} />
          <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={isJumping && !reducedMotion ? 25 : 1.5} />
          <CameraRig activeProject={activeProject} controlsRef={controlsRef} />
          {/* Mode épilepsie : on ne joue jamais l'effet de tunnel hyperespace */}
          <Suspense fallback={null}><HyperSpace isJumping={isJumping && !reducedMotion} /></Suspense>
          {!isJumping && (
            <Suspense fallback={null}>
              <VoieLactee />
              <Soleil />
              {currentPlanets.map((project) => (
                <Planete key={project.id} project={project} isActive={activeProject?.id === project.id} onClick={() => setActiveProject(project)} />
              ))}
            </Suspense>
          )}
          <EffectComposer><Bloom mipmapBlur luminanceThreshold={0.8} intensity={1.5} /></EffectComposer>
        </Canvas>
      </div>

      {/* Interface HUD avec la colonne unifiée à gauche */}
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
        systemProjects={currentPlanets}
        onSelectProject={(id) => {
          const found = currentPlanets.find((p) => p.id === id || p.name === id);
          if (found) {
            setActiveProject(found);
          }
        }}
      />
    </main>
  );
}