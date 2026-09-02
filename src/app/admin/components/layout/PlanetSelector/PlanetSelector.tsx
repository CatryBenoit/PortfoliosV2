import { Globe, Target } from "lucide-react";

// Définition de ce qu'est une planète pour ce composant
export interface Planet {
  id: string;
  name: string;
}

interface PlanetSelectorProps {
  planets: Planet[];
  selectedPlanetId: string | null;
  onSelectPlanet: (id: string) => void;
}

export default function PlanetSelector({ planets, selectedPlanetId, onSelectPlanet }: PlanetSelectorProps) {
  return (
    // Placé en haut à droite (top-8 right-8)
    <div className="absolute top-8 right-8 z-50 font-mono pointer-events-auto w-64">
      {/* Conteneur principal */}
      <div className="border-2 border-cyan-400 bg-[#070b14]/95 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.2)] flex flex-col">
        
        {/* EN-TÊTE FIXE */}
        <div className="bg-[#03060a] p-3 flex items-center justify-between text-white uppercase tracking-[0.2em] font-bold text-sm w-full border-b-2 border-cyan-400 shrink-0">
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-cyan-400 animate-pulse" />
            <span>SYSTÈME LOCAL</span>
          </div>
        </div>

        {/* LISTE TOUJOURS VISIBLE AVEC SCROLLBAR */}
        <div 
          className="hud-scrollbar flex flex-col p-1"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {planets.map((planet, index) => {
            const isSelected = selectedPlanetId === planet.id;

            return (
              <button
                key={planet.id}
                onClick={() => onSelectPlanet(planet.id)}
                // Au survol, il se décale vers la gauche (-translate-x-1) car il est sur le bord droit
                className={`shrink-0 text-left px-3 py-3 text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-95
                  ${isSelected 
                    ? "bg-cyan-500/30 text-white border-r-2 border-cyan-400" 
                    : "text-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:-translate-x-1 border-r-2 border-transparent"}
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Petit numéro généré automatiquement (01, 02...) pour le style spatial */}
                  <span className="text-[10px] text-cyan-600 font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{planet.name}</span>
                </div>

                {/* Icône de ciblage visible uniquement si la planète est sélectionnée */}
                {isSelected && (
                  <Target size={14} className="text-cyan-400 animate-[spin_4s_linear_infinite]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}