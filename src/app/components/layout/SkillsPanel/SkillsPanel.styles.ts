// SkillsPanel.styles.ts

export const SKILLS_STYLES = {
  // Positionnement absolu au centre de l'écran (avec z-index élevé)
  container: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-auto font-mono",
  
  // Le panneau principal style SF/Cyber
  panel: "w-[1350px] md:w-[1500px] p-8 border-2 border-cyan-400 bg-[#070b14] relative shadow-[0_0_40px_rgba(34,211,238,0.3)]",
  
  // En-tête du panneau
  header: "flex justify-between items-center mb-8 border-b-2 border-cyan-500/50 pb-4",
  headerSubtitle: "text-[10px] text-cyan-400 tracking-[0.3em] flex items-center gap-2 mb-1 font-bold",
  headerTitle: "text-white font-extrabold text-2xl uppercase tracking-tighter",
  
  // Bouton de fermeture (X)
  closeBtn: "p-2 text-cyan-400 border border-cyan-500/30 transition-all hover:text-red-400 hover:bg-red-500/20",
  
  // Liste et lignes de compétences
  listContainer: "space-y-6",
  skillRow: "space-y-2",
  skillInfo: "flex justify-between items-center text-xs text-white font-bold uppercase tracking-widest",
  skillLabel: "flex items-center gap-2",
  skillPercent: "text-cyan-400",
  
  // Barres de progression (Jauges)
  progressBarContainer: "h-3 bg-slate-900 border border-cyan-500/30 p-0.5",
  progressBarFill: "h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]",
  
  // Bloc de log / terminal en bas
  terminalLog: "mt-8 p-4 bg-cyan-950/20 border border-cyan-500/20 text-[10px] text-cyan-200/60 italic leading-tight uppercase"
};