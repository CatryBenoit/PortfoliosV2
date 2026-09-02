"use client";
import { useState, useEffect } from "react";
import { Shield, User, Rocket, Satellite } from "lucide-react";
import ProjectPanel from "./ProjectPanel/ProjectPanel";
import ContactForm from "./Contact/ContactForm";
import ProfilePanel from "./ProfilePanel/ProfilePanel";
import SkillsPanel from "./SkillsPanel/SkillsPanel";
import TechFilter from "./TechFilter/TechFilter";
import PlanetSelector from "./PlanetSelector/PlanetSelector"; // 🟢 AJOUT : Pense à vérifier le chemin si tu l'as mis dans un dossier
import { HUD_STYLES as S } from "./HUD.styles"; 

interface Project {
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
  
  // 🟢 NOUVELLES PROPS : Pour le sélecteur de planètes
  systemProjects: Project[]; // La liste des projets/planètes du système actuel
  onSelectProject: (projectName: string) => void; // Fonction pour cibler une planète
}

type TabType = "none" | "profile" | "skills" | "contact";

export default function HUD({ 
  activeProject, onClose, onNext, onPrev, currentSystem, onChangeSystem,
  uniqueTechs, selectedTech, onSelectTech,
  systemProjects, onSelectProject // 🟢 Récupération des nouvelles props
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
    <div className={S.wrapper}>
      <div className={S.scanline} />

      {/* DÉCORATIONS */}
      <div className={S.cornerTL} />
      <div className={S.cornerTR} />
      <div className={S.cornerBL} />
      <div className={S.cornerBR} />

      <div className={S.mainContainer}>
        
        {/* 🟢 NOUVEAU : SÉLECTEUR DE PLANÈTES (en haut à droite via absolute) */}
        <PlanetSelector 
          // On transforme tes Projets au format attendu par le PlanetSelector
          planets={systemProjects.map(p => ({ id: p.name, name: p.name }))} 
          selectedPlanetId={activeProject ? activeProject.name : null}
          onSelectPlanet={(projectName) => {
            onSelectProject(projectName); // Focus la planète en 3D
            setActiveTab("none"); // Ferme les autres panneaux pour bien voir
          }}
        />

        {/* ================= HEADER ================= */}
        <header className={S.header}>
          <div className={S.pilotBox}>
            <div className={S.pilotAvatar}>
              <User className="text-cyan-400" size={32} />
            </div>
            <div>
              <div className={S.pilotLabel}>PILOT_ID</div>
              <div className={S.pilotName}>B. CATRY</div>
            </div>
          </div>

          <nav className={S.navBar}>
            {[
              { id: 'none', label: 'RADAR', action: closeAll, active: activeTab === 'none' && !activeProject },
              { id: 'profile', label: 'PROFIL', action: () => { setActiveTab("profile"); onClose(); }, active: activeTab === 'profile' },
              { id: 'skills', label: 'COMPÉTENCES TECH', action: () => { setActiveTab("skills"); onClose(); }, active: activeTab === 'skills' },
              { id: 'contact', label: 'CONTACT', action: () => { setActiveTab("contact"); onClose(); }, active: activeTab === 'contact' }
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

        {/* ================= MILIEU ================= */}
        <div className={S.middleArea}>
          
          {/* COLONNE GAUCHE (Nav Station + Filtre) */}
          <div className={S.leftColumn}>
            <aside className={S.navStationBox}>
              <div className={S.navStationHeader}>
                <span className={S.navStationTitle}>NAV_STATION </span>
                
                <Satellite size={22} className="text-cyan-400 animate-pulse" />
              </div>
              <div className="flex flex-col gap-2">
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

            <div className={S.filterWrapper}>
              <TechFilter 
                uniqueTechs={uniqueTechs} 
                selectedTech={selectedTech} 
                onSelectTech={onSelectTech} 
              />
            </div>
          </div>

          {/* CONTENU CENTRAL (MODALS) */}
          <div className={S.centerContent}>
            {activeTab === "profile" && <ProfilePanel onClose={closeAll} />}
            {activeTab === "skills" && <SkillsPanel onClose={closeAll} />}
            {activeTab === "contact" && <ContactForm onClose={closeAll} />}
          </div>

          {/* PROJET (DROITE) */}
          {activeProject && activeTab === "none" && (
            <ProjectPanel project={activeProject} onClose={onClose} onNext={onNext} onPrev={onPrev} />
          )}

          {/* STATS DROITE */}
          <aside className={S.statsBox}>
            <div className={S.statsHeader}>
              <span>SHIP_STATS</span><Shield size={22} />
            </div>
            <div className="space-y-4">
              <div className={S.statsRow}>
                <span>SHIELDS</span><span>92%</span>
              </div>
              <div className={S.statsBarBg}>
                <div className={S.statsBarFill} />
              </div>
            </div>
          </aside>
        </div>

        {/* ================= FOOTER ================= */}
        <footer className={S.footer}>
          <div className={S.footerLeftBox}>
            <div className={S.pulsingDot} />
            <span>BELFORT_SECTOR // 47.63°N 6.86°E</span>
          </div>
          <div className={S.footerRightBox}>
            <Rocket size={18} className="text-cyan-400" />
            <span>{activeProject ? "DATA_LINK_ACTIVE" : ` SYSTEM_${currentSystem}_READY`}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}