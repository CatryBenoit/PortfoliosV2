// HUD.styles.ts
import { BUTTON, cx, panelFrame } from "./theme";

export const HUD_STYLES = {
  // Conteneurs principaux
  wrapper: "fixed inset-0 w-screen h-screen pointer-events-none z-50 font-mono overflow-hidden left-0 top-0",
  scanline: "scanline z-50",

  // Décorations d'angles
  cornerTL: "absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-lg",
  cornerTR: "absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-cyan-500/40 rounded-tr-lg",
  cornerBL: "absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-cyan-500/40 rounded-bl-lg",
  cornerBR: "absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-cyan-500/40 rounded-br-lg",

  // ================= HEADER / NAV =================
  headerWrapper: "fixed top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex items-center justify-center max-w-[calc(100vw-5rem)] sm:max-w-[calc(100vw-2rem)]",
  // Défile horizontalement (hud-scrollbar) si les 4 boutons ne tiennent pas —
  // évite qu'ils se coupent ou cassent la mise en page sur un petit écran.
  navBar: "flex items-center justify-start sm:justify-center gap-3 md:gap-4 overflow-x-auto hud-scrollbar",

  navBtnBase: BUTTON.navBase,
  navBtnActive: BUTTON.navActive,
  navBtnInactive: BUTTON.navInactive,

  // Bouton hamburger : ouvre/ferme la colonne gauche sur mobile uniquement.
  mobileMenuToggle: cx("fixed top-4 left-4 z-40 lg:hidden p-2.5 pointer-events-auto", panelFrame("sm")),
  // Fond cliquable derrière le tiroir mobile (le clic en dehors le ferme).
  // pointer-events-auto est indispensable : le wrapper parent a
  // pointer-events-none, une valeur héritée par défaut par les enfants.
  mobileMenuBackdrop: "fixed inset-0 z-30 bg-black/60 pointer-events-auto lg:hidden",

  pilotBox: cx("relative w-full shrink-0 p-2 md:p-3 flex gap-4 items-center pointer-events-auto z-20", panelFrame("md")),
  pilotAvatar: "w-10 h-10 bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shrink-0",
  pilotLabel: "text-[14px] text-cyan-400/80 tracking-[0.2em]",
  pilotName: "text-lg md:text-2xl text-white font-bold uppercase tracking-widest text-glitch",

  // ================= COLONNE GAUCHE =================
  // Sur mobile/tablette (<lg) : tiroir plein-hauteur qui coulisse depuis la
  // gauche, caché par défaut. À partir de lg : redevient la colonne fixe
  // toujours visible d'origine (translate-x-0 forcé, fond transparent).
  leftColumnBase: cx(
    "fixed z-40 top-24 bottom-16 left-0 w-[85vw] max-w-xs p-3",
    "bg-[#03060a]/95 backdrop-blur-md border-r-2 border-cyan-500/30 rounded-r-lg",
    "lg:top-6 lg:bottom-16 lg:left-6 lg:w-72 lg:max-w-none lg:p-0",
    "lg:bg-transparent lg:backdrop-blur-none lg:border-0 lg:rounded-none",
    "flex flex-col gap-5 overflow-y-auto hud-scrollbar pointer-events-auto",
    "transition-transform duration-300 ease-out lg:translate-x-0"
  ),
  leftColumnOpen: "translate-x-0",
  leftColumnClosed: "-translate-x-[110%]",

  // Nav Station (Sidebar Gauche)
  navStationBox: cx("p-3 md:p-4 w-full shrink-0 flex flex-col gap-4", panelFrame("md")),
  navStationHeader: "border-b border-cyan-500/30 pb-2 flex justify-between items-center",
  navStationTitle: "text-[20px] text-cyan-400 tracking-widest font-bold",
  sysBtnBase: BUTTON.systemBase,
  sysBtnActive: BUTTON.systemActive,
  sysBtnInactive: BUTTON.systemInactive,

  // Scanneur (technologies) : étire le reste de la colonne
  scannerWrapper: "w-full flex-1 min-h-0 flex flex-col",

  // ================= CONTENU CENTRAL (modales) =================
  // "Active" capte les clics en dehors du panneau pour le fermer ; au repos
  // elle laisse passer les clics vers la scène 3D (pointer-events-none).
  centralModalWrapper: "fixed inset-0 flex items-center justify-center pointer-events-none z-50",
  centralModalWrapperActive: "fixed inset-0 flex items-center justify-center pointer-events-auto z-50",
  centralModalInner: "pointer-events-auto",

  // ================= PANNEAU PROJET (droite) =================
  // Capte les clics en dehors du panneau (sur le fond) pour le fermer, sans
  // passer au-dessus de la colonne gauche / du header (z inférieur au leur).
  projectPanelBackdrop: "fixed inset-0 z-[25] pointer-events-auto",
  projectPanelWrapper: "fixed top-1/2 -translate-y-1/2 right-4 md:right-8 z-30 pointer-events-auto",

  // Stats (Sidebar Droite)
  statsBox: cx(
    "p-4 w-48 pointer-events-auto flex flex-col gap-5 hidden lg:flex fixed bottom-16 right-4 md:right-6 z-30",
    panelFrame("md")
  ),
  statsHeader: "border-b border-cyan-500/30 pb-2 flex justify-between items-center text-[10px] text-cyan-400 font-bold tracking-widest",
  statsRow: "space-y-1 text-[9px] text-cyan-400 flex justify-between font-bold",
  statsBarBg: "h-1.5 bg-slate-800 rounded-full border border-cyan-500/30 overflow-hidden",
  statsBarFill: "h-full bg-cyan-400 w-[92%]",

  // ================= FOOTER =================
  footer: "fixed bottom-4 left-4 right-4 md:left-6 md:right-6 z-[60] flex justify-between items-end gap-2 pointer-events-none",
  footerLeftBox: cx(
    "px-2.5 sm:px-3 py-1.5 flex items-center gap-2 sm:gap-3 pointer-events-auto text-xs sm:text-sm text-white font-bold uppercase tracking-widest min-w-0",
    panelFrame("xs")
  ),
  // Coordonnées masquées sous sm : ne garde que le nom du secteur, pour ne
  // pas forcer le footer à déborder sur les écrans étroits.
  footerCoords: "hidden sm:inline truncate",
  footerRightBox: cx(
    "px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-3 pointer-events-auto text-xs sm:text-sm text-white font-black uppercase tracking-[0.15em] sm:tracking-[0.3em] shrink-0",
    panelFrame("xs")
  ),
  pulsingDot: "w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse",
};
