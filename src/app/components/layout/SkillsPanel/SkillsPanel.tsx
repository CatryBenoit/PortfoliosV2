"use client";
import { X, Cpu, Zap, Code2, Database, Layout } from "lucide-react";
import { SKILLS_STYLES as S } from "./SkillsPanel.styles"; 

export default function SkillsPanel({ onClose }: { onClose: () => void }) {
  const skills = [
    { name: "Frontend (React / Next.js)", level: 90, icon: <Layout size={14}/> },
    { name: "Backend (Java / Node.js)", level: 85, icon: <Cpu size={14}/> },
    { name: "Database (PostgreSQL / Supabase)", level: 80, icon: <Database size={14}/> },
    { name: "Three.js / 3D Graphics", level: 75, icon: <Zap size={14}/> },
  ];

  return (
    <div className={S.container}>
      <div className={S.panel}>
        
        {/* HEADER */}
        <div className={S.header}>
          <div>
            <div className={S.headerSubtitle}>
              <Code2 size={14} /> 
              <span>CORE_COMPETENCIES</span>
            </div>
            <h2 className={S.headerTitle}>System_Specs</h2>
          </div>
          <button onClick={onClose} className={S.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* LISTE DES SKILLS */}
        <div className={S.listContainer}>
          {skills.map((skill, index) => (
            <div key={index} className={S.skillRow}>
              <div className={S.skillInfo}>
                <span className={S.skillLabel}>{skill.icon} {skill.name}</span>
                <span className={S.skillPercent}>{skill.level}%</span>
              </div>
              <div className={S.progressBarContainer}>
                <div 
                  className={S.progressBarFill} 
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* TERMINAL FOOTER */}
        <div className={S.terminalLog}>
          &gt; All systems operating at peak performance.<br/>
          &gt; Ready for integration on high-scale projects.
        </div>
      </div>
    </div>
  );
}