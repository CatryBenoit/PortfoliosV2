// theme.ts
//
// Jetons de style partagés du HUD spatial (thème "poste de pilotage cyberpunk").
// Toute couleur, ombre ou motif de layout réutilisé à plus d'un endroit doit
// être défini ici : un seul endroit à modifier pour changer tout le HUD.

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

// ---------------------------------------------------------------------------
// Surfaces & bordures
// ---------------------------------------------------------------------------
export const SURFACE = {
  void: "bg-[#010103]", // fond spatial profond
  panel: "bg-[#070b14]", // fond plein des panneaux HUD
  panelSoft: "bg-[#070b14]/95 backdrop-blur-md", // fond translucide (listes scanner)
  inset: "bg-[#03060a]", // en-têtes encastrés
  insetAlt: "bg-[#0f172a]", // groupes de boutons (nav ProjectPanel)
} as const;

export const BORDER = {
  cyan: "border-cyan-400",
  cyanSoft: "border-cyan-500/30",
  cyanMid: "border-cyan-500/50",
  transparent: "border-transparent",
} as const;

// Échelle unique de lueurs néon (au lieu d'une valeur rgba différente à chaque fichier)
export const GLOW = {
  xs: "shadow-[0_0_10px_rgba(34,211,238,0.3)]",
  sm: "shadow-[0_0_15px_rgba(34,211,238,0.25)]",
  md: "shadow-[0_0_25px_rgba(34,211,238,0.3)]",
  lg: "shadow-[0_0_40px_rgba(34,211,238,0.3)]",
  btn: "shadow-[0_0_20px_rgba(34,211,238,0.4)]",
  btnHover: "hover:shadow-[0_0_30px_rgba(34,211,238,0.7)]",
} as const;

export const TEXT = {
  label: "text-[10px] text-cyan-400 uppercase tracking-widest font-bold",
  labelWide: "text-[10px] text-cyan-400 tracking-[0.3em] uppercase font-bold",
  title: "text-white font-extrabold uppercase tracking-tighter",
} as const;

// ---------------------------------------------------------------------------
// Panneau générique : bordure cyan + fond + lueur. Base de tous les blocs HUD.
// Ne fixe volontairement pas `position` : certains appelants ont besoin de
// "fixed", d'autres de "relative" — les mélanger fait gagner l'une des deux
// classes de façon imprévisible (conflit déjà rencontré sur statsBox).
// ---------------------------------------------------------------------------
export const panelFrame = (glow: keyof typeof GLOW = "md") =>
  cx("border-2", BORDER.cyan, SURFACE.panel, GLOW[glow]);

// ---------------------------------------------------------------------------
// Modales centrées (Profil / Compétences / Contact) : même carcasse partagée
// ---------------------------------------------------------------------------
export const MODAL = {
  container:
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-auto font-mono",
  // max-w/max-h + overflow bornent la modale à l'écran quelle que soit sa
  // largeur "idéale" (jusqu'à 1800px pour Contact) — indispensable sur mobile.
  panel: (width: string) =>
    cx(width, "max-w-[95vw] max-h-[90vh] overflow-y-auto p-5 sm:p-8", panelFrame("lg")),
  header: cx("flex justify-between items-center mb-8 border-b-2", BORDER.cyanMid, "pb-4"),
  headerSubtitle: cx(TEXT.labelWide, "flex items-center gap-2 mb-1"),
  headerTitle: cx(TEXT.title, "text-2xl"),
  closeBtn: cx(
    "p-2 text-cyan-400 border cursor-pointer transition-all",
    BORDER.cyanSoft,
    "hover:text-red-400 hover:bg-red-500/20 hover:border-red-500/50"
  ),
} as const;

// ---------------------------------------------------------------------------
// Listes "scanner" (TechFilter / PlanetSelector) : boîte + en-tête + items
// ---------------------------------------------------------------------------
export const SCANNER = {
  box: cx("border-2", BORDER.cyan, SURFACE.panelSoft, GLOW.sm, "flex flex-col w-full"),
  header: cx(
    SURFACE.inset,
    "p-2 flex items-center justify-between text-white uppercase tracking-[0.2em] font-bold text-xs w-full border-b-2 shrink-0",
    BORDER.cyan
  ),
  headerLabel: "flex items-center gap-2",
  headerCount: "text-[10px] text-cyan-500 font-bold",
  list: "hud-scrollbar flex flex-col p-1 pr-1",
  item: (active: boolean) =>
    cx(
      "shrink-0 text-left px-2.5 py-1.5 text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-95 border-l-2",
      active
        ? "bg-cyan-500/30 text-white border-cyan-400"
        : cx(BORDER.transparent, "text-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:translate-x-1")
    ),
  itemArrow: "text-[10px] opacity-70",
} as const;

// ---------------------------------------------------------------------------
// Boutons de navigation & système
// ---------------------------------------------------------------------------
export const BUTTON = {
  navBase: cx(
    "min-w-[92px] sm:min-w-[170px] px-2.5 sm:px-4 py-1.5 sm:py-2",
    "text-[10px] sm:text-sm md:text-base tracking-[0.1em] sm:tracking-[0.25em] uppercase font-semibold text-white whitespace-nowrap",
    "bg-black/30 backdrop-blur-sm cursor-pointer relative overflow-hidden",
    GLOW.sm,
    "hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]",
    "transition-all duration-300 ease-out hover:scale-110 active:scale-95",
    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:to-transparent",
    "before:translate-x-[-120%] hover:before:translate-x-[120%] before:transition-transform before:duration-700",
    "clip-path-hud"
  ),
  navActive: cx("glass-panel border-cyan-500/50 text-cyan-300 bg-cyan-900/40", GLOW.xs),
  navInactive: cx(
    "glass-panel text-gray-300 hover:text-cyan-400 hover:bg-cyan-950/30",
    BORDER.transparent,
    "hover:border-cyan-500/30"
  ),

  systemBase:
    "text-left text-[11px] p-2 border-2 transition-all duration-200 font-bold tracking-widest cursor-pointer hover:translate-x-2 active:scale-95",
  systemActive: cx("border-cyan-400 bg-cyan-500/20 text-cyan-400", GLOW.xs),
  systemInactive: cx(BORDER.transparent, "text-white/40 hover:border-cyan-500/40 hover:text-white"),
} as const;
