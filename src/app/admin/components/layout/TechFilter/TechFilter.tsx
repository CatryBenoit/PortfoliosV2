import { Filter } from "lucide-react";
import { TECHFILTER_STYLES as S } from "./TechFilter.styles";

interface TechFilterProps {
  uniqueTechs: string[];
  selectedTech: string;
  onSelectTech: (tech: string) => void;
}

export default function TechFilter({ uniqueTechs, selectedTech, onSelectTech }: TechFilterProps) {
  return (
    <div className={S.wrapper}>
      <div className={S.box}>

        {/* En-tête fixe */}
        <div className={S.header}>
          <div className={S.headerLabel}>
            <Filter size={15} className="text-cyan-400 animate-pulse" />
            <span>SCANNEUR</span>
          </div>
          <span className={S.headerCount}>[{uniqueTechs.length}]</span>
        </div>

        {/* Liste défilable qui s'étire jusqu'au bas de la colonne */}
        <div className={S.list}>
          {/* Option TOUS */}
          <button onClick={() => onSelectTech("ALL")} className={S.item(selectedTech === "ALL")}>
            <span className={S.itemArrow}>&gt;</span> TOUTE LA GALAXIE
          </button>

          {/* Options dynamiques */}
          {uniqueTechs.map((tech) => (
            <button key={tech} onClick={() => onSelectTech(tech)} className={S.item(selectedTech === tech)}>
              <span className={S.itemArrow}>&gt;</span> {tech}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
