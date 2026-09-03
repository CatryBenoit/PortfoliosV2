"use client";
import { useState, useEffect } from "react";
import { Shield, User, Rocket, Satellite, Menu, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (activeProject) { setActiveTab("none"); setMobileMenuOpen(false); }
  }, [activeProject]);

  const closeAll = () => {
    setActiveTab("none");
    onClose();
    setMobileMenuOpen(false);
  };

  const handleSystemChange = (sys: "PRO" | "PERSO" | "SCOLAIRE") => {
    onChangeSystem(sys);
    closeAll();
  };

  const handleTechSelect = (tech: string) => {
    onSelectTech(tech);
    setMobileMenuOpen(false);
  };

  const handlePlanetSelect = (planetId: any) => {
    onSelectProject(planetId);
    setActiveTab("none");
    setMobileMenuOpen(false);
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
      <header className={S.headerWrapper}>
        <nav className={S.navBar}>
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

      {/* Bouton hamburger : ouvre/ferme la colonne gauche sur mobile/tablette */}
      <button
        onClick={() => setMobileMenuOpen((v) => !v)}
        className={S.mobileMenuToggle}
        aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {mobileMenuOpen ? <X size={20} className="text-cyan-400" /> : <Menu size={20} className="text-cyan-400" />}
      </button>

      {/* Fond cliquable derrière le tiroir mobile (clic en dehors = fermer) */}
      {mobileMenuOpen && (
        <div className={S.mobileMenuBackdrop} onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ================= 2. COLONNE GAUCHE COMPLÈTE (DE HAUT EN BAS) ================= */}
      <div className={`${S.leftColumnBase} ${mobileMenuOpen ? S.leftColumnOpen : S.leftColumnClosed}`}>

        {/* 1. PILOT_ID */}
        <div className={S.pilotBox}>
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
            onSelectPlanet={handlePlanetSelect}
          />
        </div>

        {/* 3. NAV STATION */}
        <aside className={S.navStationBox}>
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
        <div className={S.scannerWrapper}>
          <TechFilter
            uniqueTechs={uniqueTechs}
            selectedTech={selectedTech}
            onSelectTech={handleTechSelect}
          />
        </div>
      </div>

      {/* ================= 3. CONTENU CENTRAL (MODALS) ================= */}
      <div
        className={activeTab !== "none" ? S.centralModalWrapperActive : S.centralModalWrapper}
        onClick={activeTab !== "none" ? closeAll : undefined}
      >
        <div className={S.centralModalInner} onClick={(e) => e.stopPropagation()}>
          {activeTab === "profile" && <ProfilePanel onClose={closeAll} />}
          {activeTab === "skills" && <SkillsPanel onClose={closeAll} />}
          {activeTab === "contact" && <ContactForm onClose={closeAll} />}
        </div>
      </div>

      {/* ================= 4. PANNEAU PROJET (DROITE) ================= */}
      {activeProject && activeTab === "none" && (
        <div className={S.projectPanelBackdrop} onClick={onClose}>
          <div className={S.projectPanelWrapper} onClick={(e) => e.stopPropagation()}>
            <ProjectPanel project={activeProject} onClose={onClose} onNext={onNext} onPrev={onPrev} />
          </div>
        </div>
      )}

      {/* ================= 5. STATISTIQUES VAISSEAU (BAS DROITE) ================= */}
      <aside className={S.statsBox}>
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
          <span>BELFORT_SECTOR<span className={S.footerCoords}> // 47.63°N 6.86°E</span></span>
        </div>
        <div className={S.footerRightBox}>
          <Rocket size={16} className="text-cyan-400" />
          <span>{activeProject ? "DATA_LINK_ACTIVE" : ` SYSTEM_${currentSystem}_READY`}</span>
        </div>
      </footer>

    </div>
    
  );
}