import { Filter } from "lucide-react";

interface TechFilterProps {
  uniqueTechs: string[];
  selectedTech: string;
  onSelectTech: (tech: string) => void;
}

export default function TechFilter({ uniqueTechs, selectedTech, onSelectTech }: TechFilterProps) {
  return (
    <div className="w-full h-full flex-1 min-h-0 font-mono pointer-events-auto flex flex-col">
      <div className="border-2 border-cyan-400 bg-[#070b14]/95 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.2)] flex flex-col w-full h-full flex-1 min-h-0">
        
        {/* En-tête fixe */}
        <div className="bg-[#03060a] p-2 flex items-center justify-between text-white uppercase tracking-[0.2em] font-bold text-xs w-full border-b-2 border-cyan-400 shrink-0">
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-cyan-400 animate-pulse" />
            <span>SCANNEUR</span>
          </div>
          <span className="text-[10px] text-cyan-500 font-bold">[{uniqueTechs.length}]</span>
        </div>

        {/* Liste défilable qui s'étire jusqu'au bas de la colonne */}
        <div className="flex-1 min-h-0 overflow-y-auto hud-scrollbar flex flex-col p-1 pr-1">
          {/* Option TOUS */}
          <button
            onClick={() => onSelectTech("ALL")}
            className={`shrink-0 text-left px-2.5 py-1.5 text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-95
              ${selectedTech === "ALL" 
                ? "bg-cyan-500/30 text-white border-l-2 border-cyan-400" 
                : "text-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:translate-x-1 border-l-2 border-transparent"}
            `}
          >
            <span className="text-[10px] opacity-70">&gt;</span> TOUTE LA GALAXIE
          </button>

          {/* Options dynamiques */}
          {uniqueTechs.map((tech) => (
            <button
              key={tech}
              onClick={() => onSelectTech(tech)}
              className={`shrink-0 text-left px-2.5 py-1.5 text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-95
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