// ProjectPanel.styles.ts
import { GLOW, SURFACE, cx } from "../theme";

export const PROJECT_STYLES = {
  // Apparence uniquement : le positionnement (fixed/top/right) est géré par
  // le wrapper dans HUD.styles.ts (projectPanelWrapper) — un seul endroit
  // responsable du placement évite les conflits left/right/width superposés.
  container: cx(
    "w-[560px] max-w-[90vw] max-h-[80vh] overflow-y-auto p-8 rounded-lg border-2 border-cyan-400/50",
    SURFACE.panel,
    GLOW.md
  ),

  // En-tête (Header)
  header: "flex justify-between items-center mb-6 border-b-2 border-cyan-500/30 pb-4",
  headerTitleWrapper: "flex-1 pr-4",
  headerSubtitle: "text-[10px] text-cyan-400 tracking-[0.2em] flex items-center gap-2 mb-1",
  headerTitle: "text-white font-bold text-xl uppercase tracking-wider truncate",

  // Groupe de boutons de navigation (Haut droite)
  navGroup: cx("flex items-center gap-1.5 p-1 border border-cyan-500/50 rounded", SURFACE.insetAlt),
  navBtn: "p-1.5 text-cyan-400 rounded transition-all hover:bg-cyan-500/20",
  navCloseBtn: "p-1.5 text-cyan-400 rounded transition-all hover:bg-red-500/20 hover:text-red-400",
  navDivider: "w-[1px] h-4 bg-cyan-500/30 mx-1",

  // Contenu (Specs & Description)
  contentWrapper: "space-y-6 mb-8",
  sectionLabel: "text-[11px] text-cyan-400/70 block mb-2 uppercase tracking-widest font-bold",
  techBadge: cx("inline-block bg-cyan-500 text-black text-[12px] px-3 py-1 font-black uppercase", GLOW.xs),
  descriptionText: "text-slate-100 text-sm leading-relaxed text-left font-medium",

  // Zone d'action (Boutons du bas)
  actionGrid: "grid grid-cols-2 gap-4",
  btnSecondary: "flex items-center justify-center gap-2 bg-slate-800 border border-slate-500 py-3 text-[10px] text-white uppercase font-bold transition-all hover:bg-slate-700",
  btnPrimary: cx(
    "flex items-center justify-center gap-2 bg-cyan-600 border border-cyan-400 py-3 text-[10px] text-white uppercase font-bold transition-all hover:bg-cyan-500",
    GLOW.sm
  ),
};
