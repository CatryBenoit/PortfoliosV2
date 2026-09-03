// ProfilePanel.styles.ts
import { MODAL } from "../theme";

export const PROFILE_STYLES = {
  // Carcasse de la modale (partagée avec Skills / Contact)
  container: MODAL.container,
  panel: MODAL.panel("w-[1350px] md:w-[1600px]"),
  header: MODAL.header,
  headerSubtitle: MODAL.headerSubtitle,
  headerTitle: MODAL.headerTitle,
  closeBtn: MODAL.closeBtn,

  // Grille de contenu principal
  grid: "grid grid-cols-1 md:grid-cols-3 gap-6",

  // Colonne Avatar
  avatarWrapper: "flex flex-col items-center",
  avatarBox: "w-32 h-32 border-2 border-cyan-400 bg-cyan-900/20 flex items-center justify-center mb-4 relative overflow-hidden group",
  avatarIcon: "text-cyan-400 transition-transform group-hover:scale-110",
  avatarOverlay: "absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent",
  avatarRank: "text-[10px] text-cyan-400 font-bold uppercase",

  // Colonne Informations
  infoWrapper: "md:col-span-2 space-y-4",
  bioSection: "space-y-2",
  location: "flex items-center gap-2 text-cyan-200 text-sm font-bold uppercase tracking-wider",
  bioText: "text-slate-100 text-sm leading-relaxed text-justify",

  // Grille des Statistiques (Missions / Exp)
  statsGrid: "grid grid-cols-2 gap-4 pt-4 border-t border-cyan-900/50",
  statLabel: "text-[9px] text-cyan-400 font-bold uppercase mb-1",
  statValue: "text-white text-lg font-black tracking-widest",
};
