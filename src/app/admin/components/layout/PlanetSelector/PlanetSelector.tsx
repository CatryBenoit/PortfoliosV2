import { Globe, Target } from "lucide-react";
import { PLANETSELECTOR_STYLES as S } from "./PlanetSelector.styles";

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
    <div className={S.wrapper}>
      <div className={S.box}>

        {/* En-tête fixe */}
        <div className={S.header}>
          <div className={S.headerLabel}>
            <Globe size={15} className="text-cyan-400 animate-pulse" />
            <span>PLANÈTES</span>
          </div>
          <span className={S.headerCount}>[{planets.length}]</span>
        </div>

        {/* Liste défilable des planètes */}
        <div className={S.list} style={{ maxHeight: "135px", overflowY: "auto" }}>
          {planets.length === 0 ? (
            <div className={S.emptyState}>AUCUNE PLANÈTE</div>
          ) : (
            planets.map((planet, index) => {
              const isSelected = selectedPlanetId === planet.id;

              return (
                <button
                  key={planet.id}
                  onClick={() => onSelectPlanet(planet.id)}
                  className={`${S.item(isSelected)} justify-between`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={S.itemIndex}>{String(index + 1).padStart(2, "0")}</span>
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
