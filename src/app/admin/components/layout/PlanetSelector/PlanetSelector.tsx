import { Globe, Target } from "lucide-react";

export interface PlanetItem {
  id: string | number;
  name: string;
}

interface PlanetSelectorProps {
  planets: PlanetItem[];
  selectedPlanetId: string | number | null;
  onSelectPlanet: (id: string | number) => void;
}

export default function PlanetSelector({ planets, selectedPlanetId, onSelectPlanet }: PlanetSelectorProps) {
  return (
    <div className="w-full font-mono pointer-events-auto shrink-0">
      <div className="border-2 border-cyan-400 bg-[#070b14]/95 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.2)] flex flex-col w-full">
        
        {/* En-tête fixe */}
        <div className="bg-[#03060a] p-2 flex items-center justify-between text-white uppercase tracking-[0.2em] font-bold text-xs w-full border-b-2 border-cyan-400 shrink-0">
          <div className="flex items-center gap-2">
            <Globe size={15} className="text-cyan-400 animate-pulse" />
            <span>PLANÈTES</span>
          </div>
          <span className="text-[10px] text-cyan-500 font-bold">[{planets.length}]</span>
        </div>

        {/* Liste défilable des planètes */}
        <div 
          className="hud-scrollbar flex flex-col p-1 pr-1"
          style={{ maxHeight: "135px", overflowY: "auto" }}
        >
          {planets.length === 0 ? (
            <div className="text-[11px] text-white/40 p-2 text-center italic">
              AUCUNE PLANÈTE
            </div>
          ) : (
            planets.map((planet, index) => {
              const isSelected = selectedPlanetId === planet.id;

              return (
                <button
                  key={planet.id}
                  onClick={() => onSelectPlanet(planet.id)}
                  className={`shrink-0 text-left px-2.5 py-1.5 text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-95
                    ${isSelected 
                      ? "bg-cyan-500/30 text-white border-l-2 border-cyan-400" 
                      : "text-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:translate-x-1 border-l-2 border-transparent"}
                  `}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] text-cyan-600 font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate">{planet.name}</span>
                  </div>

                  {isSelected && (
                    <Target size={14} className="text-cyan-400 shrink-0 animate-[spin_4s_linear_infinite]" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}