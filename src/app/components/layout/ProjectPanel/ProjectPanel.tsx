"use client";
import { Activity, ChevronLeft, ChevronRight, X, Code, ExternalLink } from "lucide-react";
import { PROJECT_STYLES as S } from "./ProjectPanel.styles";

interface Project {
  name: string;
  tech: string;
  description: string;
}

interface ProjectPanelProps {
  project: Project;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ProjectPanel({ project, onClose, onNext, onPrev }: ProjectPanelProps) {
  return (
    <div className={S.container}>
      
      {/* HEADER AVEC NAVIGATION */}
      <div className={S.header}>
        <div className={S.headerTitleWrapper}>
          <div className={S.headerSubtitle}>
            <Activity size={14} className="animate-pulse" /> 
            <span>DATA_STREAM</span>
          </div>
          <h2 className={S.headerTitle}>
            {project.name}
          </h2>
        </div>
        
        <div className={S.navGroup}>
          <button onClick={onPrev} className={S.navBtn}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={onNext} className={S.navBtn}>
            <ChevronRight size={18} />
          </button>
          <div className={S.navDivider} />
          <button onClick={onClose} className={S.navCloseBtn}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* CONTENU */}
      <div className={S.contentWrapper}>
        <div>
          <span className={S.sectionLabel}>Système_Tech</span>
          <span className={S.techBadge}>
            {project.tech}
          </span>
        </div>
        
        <div>
          <span className={S.sectionLabel}>Logs_Description</span>
          <p className={S.descriptionText}>
            {project.description}
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className={S.actionGrid}>
        <button className={S.btnSecondary}>
          <Code size={14} /> GitHub
        </button>
        <button className={S.btnPrimary}>
          <ExternalLink size={14} /> Déployer
        </button>
      </div>

    </div>
  );
}