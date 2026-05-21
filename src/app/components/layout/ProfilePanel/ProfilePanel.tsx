"use client";
import { X, User, MapPin, Terminal } from "lucide-react";
import { PROFILE_STYLES as S } from "./ProfilePanel.styles"; 

export default function ProfilePanel({ onClose }: { onClose: () => void }) {
  return (
    <div className={S.container}>
      <div className={S.panel}>
        
        {/* HEADER */}
        <div className={S.header}>
          <div>
            <div className={S.headerSubtitle}>
              <Terminal size={14} /> 
              <span>BIO_DATABASE_ACCESS</span>
            </div>
            <h2 className={S.headerTitle}>Profile</h2>
          </div>
          <button onClick={onClose} className={S.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* CONTENU PROFIL */}
        <div className={S.grid}>
          
          {/* Photo ou Icone */}
          <div className={S.avatarWrapper}>
            <div className={S.avatarBox}>
               <User size={64} className={S.avatarIcon} />
               <div className={S.avatarOverlay} />
            </div>
            <span className={S.avatarRank}>Benoit Catry</span>
          </div>

          {/* Bio Text */}
          <div className={S.infoWrapper}>
            <div className={S.bioSection}>
              <div className={S.location}>
                <MapPin size={14} /> Secteur: France, Belfort
              </div>
              <p className={S.bioText}>
                 Bonjour, je suis Benoît Catry, étudiant en BUT Informatique à l’Université Louis et Marie Pasteur de Belfort. Mon intérêt pour l'informatique est né d’une envie de comprendre ce qui se cache derrière un programme et comment les systèmes fonctionnent réellement. 
               </p>
                <p>
                Au fil de mes projets, j’ai découvert une dimension essentielle du développement : répondre à des besoins réels par des solutions simples, efficaces et accessibles. J’aime concevoir des outils qui apportent une valeur concrète aux utilisateurs, quel que soit le domaine ou la technologie utilisée.
              </p>
              <p>
                Je m’intéresse particulièrement à l’évolution des technologies et des pratiques du secteur, ce qui me pousse à suivre régulièrement les nouveautés et les approches émergentes. Cette curiosité me permet d’adapter mes méthodes de travail et de choisir les outils les plus pertinents pour chaque projet.
              </p>
              <p>
                J’apprends beaucoup par l’expérimentation, les tests et la construction. Pour moi, transformer une idée en un produit clair, fiable et fonctionnel est ce qui donne tout son sens au développement informatique. 
              </p>
            </div>

            {/* Statistiques  en bas */}
            <div className={S.statsGrid}>
              <div> 
              </div>
              <div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}