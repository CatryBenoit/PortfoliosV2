import { Filter } from "lucide-react";

interface TechFilterProps {
  uniqueTechs: string[];
  selectedTech: string;
  onSelectTech: (tech: string) => void;
}

export default function TechFilter({ uniqueTechs, selectedTech, onSelectTech }: TechFilterProps) {
  return (
    <div className="absolute top-8 left-8 z-50 font-mono pointer-events-auto w-64">
      {/* Conteneur principal */}
      <div className="border-2 border-cyan-400 bg-[#070b14]/95 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.2)] flex flex-col">
        
        {/* EN-TÊTE FIXE (shrink-0 l'empêche de s'écraser) */}
        <div className="bg-[#03060a] p-3 flex items-center justify-between text-white uppercase tracking-[0.2em] font-bold text-sm w-full border-b-2 border-cyan-400 shrink-0">
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-cyan-400 animate-pulse" />
            <span>SCANNEUR</span>
          </div>
        </div>

        {/* LISTE TOUJOURS VISIBLE AVEC SCROLLBAR */}
        {/* 🔴 FIX : On utilise le style en ligne pour forcer la hauteur quoiqu'il arrive */}
        <div 
          className="hud-scrollbar flex flex-col p-1 pr-1"
          style={{ maxHeight: "250px", overflowY: "auto" }}
        >
          
          {/* Option TOUS (shrink-0 force la bonne taille du bouton) */}
          <button
            onClick={() => onSelectTech("ALL")}
            className={`shrink-0 text-left px-3 py-2.5 text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-95
              ${selectedTech === "ALL" 
                ? "bg-cyan-500/30 text-white border-l-2 border-cyan-400" 
                : "text-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:translate-x-1 border-l-2 border-transparent"}
            `}
          >
            <span className="text-[10px] opacity-70">&gt;</span> TOUTE LA GALAXIE
          </button>

          {/* Options dynamiques (shrink-0 force la bonne taille) */}
          {uniqueTechs.map((tech) => (
            <button
              key={tech}
              onClick={() => onSelectTech(tech)}
              className={`shrink-0 text-left px-3 py-2.5 text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-95
                ${selectedTech === tech 
                  ? "bg-cyan-500/30 text-white border-l-2 border-cyan-400" 
                  : "text-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:translate-x-1 border-l-2 border-transparent"}
              `}
            >
              <span className="text-[10px] opacity-70">&gt;</span> {tech}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}