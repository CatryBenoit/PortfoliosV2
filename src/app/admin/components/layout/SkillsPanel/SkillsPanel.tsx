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
          <div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          {categories.map((category, index) => (
            <div
              key={index}
              className="
                border border-cyan-500/30
                bg-black/30
                p-4
                backdrop-blur-sm
              "
            >
              {/* CATEGORY TITLE */}
              <div className="
                flex items-center gap-2
                text-cyan-400
                font-bold
                text-xs
                tracking-[0.25em]
                uppercase
                mb-4
              ">
                {category.icon}
                {category.title}
              </div>

              {/* SKILLS */}
              <div className="
                flex flex-wrap gap-2
                flex flex-wrap gap-x-4 gap-y-2
              ">
                {category.skills.map((skill, i) => (
                  <div
                    key={i}
                    className="
                      px-10 py-10
                      bg-cyan-500/5
                      p-10

                      text-white
                      text-xs
                      uppercase
                      tracking-wider

                      hover:bg-cyan-400/10
                      flex flex-wrap gap-x-4 gap-y-2

                      transition-all
                    "
                  >

                  {skill  + "," +  "\u00A0"}
                  </div>
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