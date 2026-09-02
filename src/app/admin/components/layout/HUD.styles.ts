// HUD.styles.ts

export const HUD_STYLES = {
  // Conteneurs principaux
  wrapper: "fixed inset-0 w-screen h-screen pointer-events-none z-50 font-mono overflow-hidden left-0 top-0",
  scanline: "scanline z-50",
  mainContainer: "w-full h-full flex flex-col justify-between p-4 md:p-8",
  
  // Décorations d'angles
  cornerTL: "absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-lg",
  cornerTR: "absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-cyan-500/40 rounded-tr-lg",
  cornerBL: "absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-cyan-500/40 rounded-bl-lg",
  cornerBR: "absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-cyan-500/40 rounded-br-lg",
  
  // ================= HEADER =================
  header: " w-full flex items-center relative z-10",

  pilotBox: "glass-panel p-2 md:p-3 flex gap-4 items-center pointer-events-auto border-2 border-cyan-400 bg-[#070b14] relative z-20",
  pilotAvatar: "w-10 h-10 bg-cyan-500/20 border border-cyan-400 flex items-center justify-center",
  pilotLabel: "text-[14px] text-cyan-400/80 tracking-[0.2em]",
  pilotName: "text-[24px] text-white font-bold uppercase tracking-widest text-glitch text-sm",
  
  // 🟢 LA LIGNE CORRIGÉE : Utilisation de top-1/2 et -translate-y-1/2 pour s'aligner exactement sur le milieu du Pilot ID
navBar: `
absolute left-1/2 -translate-x-1/2

glass-nav
px-4 py-2

flex items-center
gap-[25px]

pointer-events-auto
`
,navBtnBase: `
min-w-[170px]
text-[18px]

px-4 py-2
text-sm md:text-base
uppercase tracking-[0.25em]
font-semibold text-white

 
bg-black/30 backdrop-blur-sm

shadow-[0_0_8px_rgba(0,255,255,0.25)]
hover:shadow-[0_0_14px_rgba(0,255,255,0.55)]


transition-all duration-300
relative overflow-hidden

before:absolute before:inset-0
before:bg-gradient-to-r
before:from-transparent
before:to-transparent
before:translate-x-[-120%]
hover:before:translate-x-[120%]
before:transition-transform before:duration-700

clip-path-hud
cursor-pointer 
transition-all duration-300 ease-out
hover:scale-110
hover:border-cyan-400
hover:bg-cyan-500/20
    hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]
    hover:text-white
    hover:border-cyan-400
active:scale-95


`
,
  navBtnActive: " glass-panel border-cyan-500/50 text-cyan-300 bg-cyan-900/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]",
  navBtnInactive: " glass-panel border-transparent text-gray-300 hover:text-cyan-400 hover:bg-cyan-950/30 hover:border-cyan-500/30",
  
  // ================= MILIEU =================
  middleArea: "flex-1 w-full flex justify-between items-center relative py-4",
  leftColumn: "flex flex-col gap-4 relative z-50",
  centerContent: "absolute inset-0 flex items-center justify-center pointer-events-none left-1/2",
  
  // Nav Station (Sidebar Gauche)
  navStationBox: "glass-panel p-3 md:p-4 w-56 md:w-80 pointer-events-auto flex flex-col gap-4 border-2 border-cyan-400 bg-[#070b14]",
  navStationHeader: "border-b border-cyan-500/30 pb-2 flex justify-between items-center",
  navStationTitle: "text-[20px] text-cyan-400 tracking-widest font-bold",
  sysBtnBase: "text-left text-[18x] md:text-[11px] p-2 border-2 transition-all duration-200 font-bold tracking-widest cursor-pointer hover:translate-x-2 active:scale-95",    
  sysBtnActive: "border-cyan-400 bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]",
  sysBtnInactive: "border-transparent text-white/40 hover:border-cyan-500/40 hover:text-white",
  filterWrapper: "pointer-events-auto",
  
  // Stats (Sidebar Droite)
  statsBox: "glass-panel p-4 w-48 pointer-events-auto flex flex-col gap-5 hidden lg:flex border-2 border-cyan-400 bg-[#070b14] self-center",
  statsHeader: "border-b border-cyan-500/30 pb-2 flex justify-between items-center text-[10px] text-cyan-400 font-bold tracking-widest",
  statsRow: "space-y-1 text-[9px] text-cyan-400 flex justify-between font-bold",
  statsBarBg: "h-1.5 bg-slate-800 rounded-full border border-cyan-500/30 overflow-hidden",
  statsBarFill: "h-full bg-cyan-400 w-[92%]",
  
  // ================= FOOTER =================
  footer: "w-full flex justify-between items-end relative z-10",
  footerLeftBox: "glass-panel px-3 py-1.5 flex items-center gap-3 pointer-events-auto border-2 border-cyan-400 bg-[#070b14] text-[18px] text-white font-bold uppercase tracking-widest",
  footerRightBox: "glass-panel px-4 py-2 flex items-center gap-3 pointer-events-auto border-2 border-cyan-400 bg-[#070b14] text-[18px] text-white font-black uppercase tracking-[0.3em]",
  pulsingDot: "w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"
}; 