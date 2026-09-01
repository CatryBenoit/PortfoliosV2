// ProfilePanel.styles.ts

export const PROFILE_STYLES = {
  // Positionnement centralisé absolu
  container: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-auto font-mono",
  
  // Cadre global du profil
  panel: "w-[1350px] md:w-[1600px] p-8 border-2 border-cyan-400 bg-[#070b14] relative shadow-[0_0_40px_rgba(34,211,238,0.3)]",
  
  // En-tête (Header)
  header: "flex justify-between items-center mb-8 border-b-2 border-cyan-500/50 pb-4",
  headerSubtitle: "text-[10px] text-cyan-400 tracking-[0.3em] flex items-center gap-2 mb-1 font-bold",
  headerTitle: "text-white font-extrabold text-2xl uppercase tracking-tighter",
  closeBtn: "p-2 text-cyan-400 border border-cyan-500/30 transition-all hover:text-red-400 hover:bg-red-500/20",
  
  // Grille de contenu principal
  grid: "grid grid-cols-1 md:grid-cols-3 gap-6",
  
  // Colonne Avatar / Avatar Column
  avatarWrapper: "flex flex-col items-center",
  avatarBox: "w-32 h-32 border-2 border-cyan-400 bg-cyan-900/20 flex items-center justify-center mb-4 relative overflow-hidden group",
  avatarIcon: "text-cyan-400 transition-transform group-hover:scale-110",
  avatarOverlay: "absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent",
  avatarRank: "text-[10px] text-cyan-400 font-bold uppercase",
  
  // Colonne Informations / Info Column
  infoWrapper: "md:col-span-2 space-y-4",
  bioSection: "space-y-2",
  location: "flex items-center gap-2 text-cyan-200 text-sm font-bold uppercase tracking-wider",
  bioText: "text-slate-100 text-sm leading-relaxed text-justify",
  
  // Grille des Statistiques (Missions / Exp)
  statsGrid: "grid grid-cols-2 gap-4 pt-4 border-t border-cyan-900/50",
  statLabel: "text-[9px] text-cyan-400 font-bold uppercase mb-1",
  statValue: "text-white text-lg font-black tracking-widest"
};