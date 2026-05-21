// ProjectPanel.styles.ts

export const PROJECT_STYLES = {
  // Conteneur principal avec tes dimensions et ton centrage vertical spécifique
  container: "absolute top-1/2 left-1/2 right-6 md:right-12 z-50 pointer-events-auto overflow-y-auto w-[560px] max-h-[95vh] -translate-y-1/2 p-8 rounded-lg border-2 border-[#22d3ee80] bg-[#070b14] shadow-[0_0_30px_rgba(34,211,238,0.3)]",
  
  // En-tête (Header)
  header: "flex justify-between items-center mb-6 border-b-2 border-cyan-500/30 pb-4",
  headerTitleWrapper: "flex-1 pr-4",
  headerSubtitle: "text-[10px] text-cyan-400 tracking-[0.2em] flex items-center gap-2 mb-1",
  headerTitle: "text-white font-bold text-xl uppercase tracking-wider truncate",
  
  // Groupe de boutons de navigation (Haut droite)
  navGroup: "flex items-center gap-1.5 bg-[#0f172a] p-1 border border-cyan-500/50 rounded",
  navBtn: "p-1.5 text-cyan-400 rounded transition-all hover:bg-cyan-500/20",
  navCloseBtn: "p-1.5 text-cyan-400 rounded transition-all hover:bg-red-500/20 hover:text-red-400",
  navDivider: "w-[1px] h-4 bg-cyan-500/30 mx-1",
  
  // Contenu (Specs & Description)
  contentWrapper: "space-y-6 mb-8",
  sectionLabel: "text-[11px] text-cyan-400/70 block mb-2 uppercase tracking-widest font-bold",
  techBadge: "inline-block bg-cyan-500 text-black text-[12px] px-3 py-1 font-black uppercase shadow-[0_0_10px_rgba(34,211,238,0.4)]",
  descriptionText: "text-slate-100 text-sm leading-relaxed text-left font-medium",
  
  // Zone d'action (Boutons du bas)
  actionGrid: "grid grid-cols-2 gap-4",
  btnSecondary: "flex items-center justify-center gap-2 bg-slate-800 border border-slate-500 py-3 text-[10px] text-white uppercase font-bold transition-all hover:bg-slate-700",
  btnPrimary: "flex items-center justify-center gap-2 bg-cyan-600 border border-cyan-400 py-3 text-[10px] text-white uppercase font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:bg-cyan-500"
};