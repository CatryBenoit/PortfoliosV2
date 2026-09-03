"use client";
import { useState, useEffect } from "react";
import { Shield, User, Rocket, Satellite } from "lucide-react";
import ProjectPanel from "./ProjectPanel/ProjectPanel";
import ContactForm from "./Contact/ContactForm";
import ProfilePanel from "./ProfilePanel/ProfilePanel";
import SkillsPanel from "./SkillsPanel/SkillsPanel";
import TechFilter from "./TechFilter/TechFilter";
import PlanetSelector from "./PlanetSelector/PlanetSelector"; 
import { HUD_STYLES as S } from "./HUD.styles"; 

interface Project {
  id?: string | number;
  name: string;
  tech: string;
  description: string;
}

interface HUDProps {
  activeProject: Project | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentSystem: "PRO" | "PERSO" | "SCOLAIRE";
  onChangeSystem: (system: "PRO" | "PERSO" | "SCOLAIRE") => void;
  uniqueTechs: string[];
  selectedTech: string;
  onSelectTech: (tech: string) => void;
  systemProjects: Project[];
  onSelectProject: (projectId: any) => void;
}

type TabType = "none" | "profile" | "skills" | "contact";

export default function HUD({ 
  activeProject, onClose, onNext, onPrev, currentSystem, onChangeSystem,
  uniqueTechs, selectedTech, onSelectTech,
  systemProjects, onSelectProject
}: HUDProps) {
  const [activeTab, setActiveTab] = useState<TabType>("none");

  useEffect(() => {
    if (activeProject) setActiveTab("none");
  }, [activeProject]);

  const closeAll = () => {
    setActiveTab("none");
    onClose();
  };

  const handleSystemChange = (sys: "PRO" | "PERSO" | "SCOLAIRE") => {
    onChangeSystem(sys);
    closeAll();
  };

  return (
    <div> 
    <div className={S.wrapper}>
      <div className={S.scanline} />

      {/* Décorations de coins */}
      <div className={S.cornerTL} />
      <div className={S.cornerTR} />
      <div className={S.cornerBL} />
      <div className={S.cornerBR} />

      {/* ================= 1. BARRE DE NAVIGATION SUPÉRIEURE (CENTRÉE ET ENTIÈREMENT VISIBLE) ================= */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex items-center justify-center">
        <nav className="flex items-center justify-center gap-3 md:gap-4 !translate-y-0 !transform-none">
          {[
            { id: "none", label: "RADAR", action: closeAll, active: activeTab === "none" && !activeProject },
            { id: "profile", label: "PROFIL", action: () => { setActiveTab("profile"); onClose(); }, active: activeTab === "profile" },
            { id: "skills", label: "COMPÉTENCES TECH", action: () => { setActiveTab("skills"); onClose(); }, active: activeTab === "skills" },
            { id: "contact", label: "CONTACT", action: () => { setActiveTab("contact"); onClose(); }, active: activeTab === "contact" }
          ].map((btn) => (
            <button 
              key={btn.id}
              onClick={btn.action} 
              className={`${S.navBtnBase} ${btn.active ? S.navBtnActive : S.navBtnInactive}`}
            >
              {btn.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ================= 2. COLONNE GAUCHE COMPLÈTE (DE HAUT EN BAS) ================= */}
      <div className="fixed top-6 bottom-12 left-4 md:left-6 w-64 md:w-72 flex flex-col gap-5 z-30 pointer-events-auto">
        
        {/* 1. PILOT_ID */}
        <div className={`${S.pilotBox} w-full shrink-0`}>
          <div className={S.pilotAvatar}>
            <User className="text-cyan-400" size={28} />
          </div>
          <div>
            <div className={S.pilotLabel}>PILOT_ID</div>
            <div className={S.pilotName}>B. CATRY</div>
          </div>
        </div>

        {/* 2. SÉLECTEUR DE PLANÈTES */}
        <div className="w-full shrink-0">
          <PlanetSelector
            planets={(systemProjects || []).map((p) => ({ id: p.id ?? p.name, name: p.name }))}
            selectedPlanetId={activeProject?.id ?? activeProject?.name ?? null}
            onSelectPlanet={(planetId) => {
              onSelectProject(planetId);
              setActiveTab("none");
            }}
          />
        </div>

        {/* 3. NAV STATION */}
        <aside className={`${S.navStationBox} w-full shrink-0`}>
          <div className={S.navStationHeader}>
            <span className={S.navStationTitle}>NAV_STATION </span>
            <Satellite size={18} className="text-cyan-400 animate-pulse" />
          </div>
          <div className="flex flex-col gap-1.5">
            {(["PRO", "PERSO", "SCOLAIRE"] as const).map((sys) => (
              <button 
                key={sys} 
                onClick={() => handleSystemChange(sys)}
                className={`${S.sysBtnBase} ${currentSystem === sys ? S.sysBtnActive : S.sysBtnInactive}`}
              >
                {`> ${sys}`}
              </button>
            ))}
          </div>
        </aside>

        {/* 4. SCANNEUR (S'ÉTIRE POUR REMPLIR TOUT LE BAS DE LA COLONNE) */}
        <div className="w-full flex-1 min-h-0 flex flex-col">
          <TechFilter 
            uniqueTechs={uniqueTechs} 
            selectedTech={selectedTech} 
            onSelectTech={onSelectTech} 
          />
        </div>
      </div>

      {/* ================= 3. CONTENU CENTRAL (MODALS) ================= */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <div className="pointer-events-auto">
          {activeTab === "profile" && <ProfilePanel onClose={closeAll} />}
          {activeTab === "skills" && <SkillsPanel onClose={closeAll} />}
          {activeTab === "contact" && <ContactForm onClose={closeAll} />}
        </div>
      </div>

      {/* ================= 4. PANNEAU PROJET (DROITE) ================= */}
      {activeProject && activeTab === "none" && (
        <div className="fixed top-20 right-4 md:right-8 z-30 pointer-events-auto">
          <ProjectPanel project={activeProject} onClose={onClose} onNext={onNext} onPrev={onPrev} />
        </div>
      )}

      {/* ================= 5. STATISTIQUES VAISSEAU (BAS DROITE) ================= */}
      <aside className={`${S.statsBox} fixed bottom-12 right-4 md:right-6 z-30 pointer-events-auto`}>
        <div className={S.statsHeader}>
          <span>SHIP_STATS</span><Shield size={20} />
        </div>
        <div className="space-y-3">
          <div className={S.statsRow}>
            <span>SHIELDS</span><span>92%</span>
          </div>
          <div className={S.statsBarBg}>
            <div className={S.statsBarFill} />
          </div>
        </div>
      </aside>


    </div>
{/* ================= 6. FOOTER ================= */}
      <footer className={S.footer}>
        <div className={S.footerLeftBox}>
          <div className={S.pulsingDot} />
          <span>BELFORT_SECTOR // 47.63°N 6.86°E</span>
        </div>
        <div className={S.footerRightBox}>
          <Rocket size={16} className="text-cyan-400" />
          <span>{activeProject ? "DATA_LINK_ACTIVE" : ` SYSTEM_${currentSystem}_READY`}</span>
        </div>
      </footer>

    </div>
    
  );
}