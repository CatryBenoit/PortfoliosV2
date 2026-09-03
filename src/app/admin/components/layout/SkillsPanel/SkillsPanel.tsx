"use client";

import {
  X,
  Code2,
  Database,
  Monitor,
  Server,
  Wrench,
  BrainCircuit,
  Users,
} from "lucide-react";

import { SKILLS_STYLES as S } from "./SkillsPanel.styles";

export default function SkillsPanel({
  onClose,
}: {
  onClose: () => void;
}) {
  const categories = [
    {
      title: "LANGUAGES",
      icon: <Code2 size={16} />,
      skills: [
        "C",
        "C++",
        "Python",
        "Java",
        "JavaScript",
        "Kotlin",
        "Swift",
        "PHP",
        "HTML",
        "CSS",
      ],
    },

    {
      title: "DATABASES",
      icon: <Database size={16} />,
      skills: [
        "MySQL",
        "PostgreSQL",
        "IBM Db2",
        "Redis",
      ],
    },

    {
      title: "FRAMEWORKS",
      icon: <Server size={16} />,
      skills: [
        "Flask",
        "Spring Boot",
        "Laravel",
        "Vue.js",
        "Angular",
      ],
    },

    {
      title: "SYSTEMS",
      icon: <Monitor size={16} />,
      skills: [
        "Linux",
        "Windows",
      ],
    },

    {
      title: "SOFTWARE",
      icon: <Wrench size={16} />,
      skills: [
        "Visual Studio Code",
        "IntelliJ IDEA",
        "Microsoft Office",
        "Arduino IDE",
      ],
    },

    {
      title: "ANALYSIS & DESIGN",
      icon: <BrainCircuit size={16} />,
      skills: [
        "Analyse des besoins",
        "Cahier des charges",
        "Merise",
        "UML",
      ],
    },

    {
      title: "SOFT SKILLS",
      icon: <Users size={16} />,
      skills: [
        "Travail en équipe",
        "Communication",
        "Autonomie",
        "Résolution de problèmes",
      ],
    },
  ];

  return (
    <div className={S.container}>
      <div className={S.panel}>
        
        {/* HEADER */}
        <div className={S.header}>
          <div className={S.headerTitleWrapper}>
            <div className={S.headerSubtitle}>
              <Code2 size={14} />
              <span>CORE_COMPETENCIES</span>
            </div>

            <h2 className={S.headerTitle}>
              System_Specifications
            </h2>
          </div>

          <button
            onClick={onClose}
            className={S.closeBtn}
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className={S.categoryGrid}>

          {categories.map((category, index) => (
            <div key={index} className={S.categoryCard}>
              {/* CATEGORY TITLE */}
              <div className={S.categoryTitle}>
                {category.icon}
                {category.title}
              </div>

              {/* SKILLS */}
              <div className={S.skillList}>
                {category.skills.map((skill, i) => (
                  <span key={i} className={S.skillBadge}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className={S.terminalLog}>
          &gt; Multi-domain engineering profile detected.
          <br />
          &gt; Ready for full-stack, embedded and software architecture missions.
        </div>
      </div>
    </div>
  );
}