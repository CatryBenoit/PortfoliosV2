import { Filter } from "lucide-react";

interface TechFilterProps {
  uniqueTechs: string[];
  selectedTech: string;
  onSelectTech: (tech: string) => void;
}

export default function TechFilter({ uniqueTechs, selectedTech, onSelectTech }: TechFilterProps) {
  return (
    <div className="absolute top-8 left-8 z-50 font-mono pointer-events-auto">
      <div className="flex items-center gap-2 mb-2 text-cyan-400 text-[18px] uppercase tracking-[0.2em] font-bold">
        <Filter size={20} className="animate-pulse" /> 
        <span>Scanneur</span>
      </div>
      
      <div className="relative">
        <select
          value={selectedTech}
          onChange={(e) => onSelectTech(e.target.value)}
          className="appearance-none bg-[#070b14]/80 border-2 border-cyan-500/50 text-cyan-400 text-xs uppercase tracking-widest py-2 pl-3 pr-8 outline-none cursor-pointer hover:border-cyan-400 transition-all backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.1)]"
        >
          <option value="ALL">-- TOUTE LA GALAXIE --</option>
          {uniqueTechs.map((tech) => (
            <option key={tech} value={tech} className="bg-[#010103]">
              {tech}
            </option>
          ))}
        </select>
        {/* Petite flèche personnalisée pour le côté HUD */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-400 text-[10px]">
          ▼
        </div>
      </div>
    </div>
  );
}