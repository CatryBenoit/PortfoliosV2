// SkillsPanel.styles.ts
import { MODAL, TEXT, cx } from "../theme";

export const SKILLS_STYLES = {
  // Carcasse de la modale (partagée avec Profile / Contact)
  container: MODAL.container,
  // lg:p-12 s'ajoute (ne remplace pas en conflit) au p-5 sm:p-8 déjà posé par
  // MODAL.panel — jamais deux classes de la même propriété au même breakpoint.
  panel: MODAL.panel("w-[1350px] md:w-[1500px] lg:p-12"),
  header: cx(MODAL.header, "mb-10 pb-5 gap-4"),
  headerTitleWrapper: "min-w-0 flex-1",
  headerSubtitle: MODAL.headerSubtitle,
  // Ne réutilise pas MODAL.headerTitle (qui fixe déjà text-2xl) pour éviter
  // toute classe de taille en double — échelle responsive posée ici seule.
  headerTitle: cx(TEXT.title, "text-lg sm:text-2xl lg:text-3xl text-glitch break-words"),
  closeBtn: cx(MODAL.closeBtn, "shrink-0"),

  // Grille des catégories
  categoryGrid: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6",
  categoryCard: "border border-cyan-500/30 bg-black/30 p-4 backdrop-blur-sm",
  categoryTitle: "flex items-center gap-2 text-cyan-400 font-bold text-xs tracking-[0.25em] uppercase mb-4",

  // Badges de compétences
  skillList: "flex flex-wrap gap-x-4 gap-y-2",
  skillBadge: "px-3 py-1.5 bg-cyan-500/5 text-white text-xs uppercase tracking-wider hover:bg-cyan-400/10 transition-all",

  // TERMINAL FOOTER
  terminalLog: cx(
    "mt-10 p-5 border border-cyan-500/20 text-[10px] text-cyan-200/60 italic leading-loose uppercase tracking-[0.15em]",
    "bg-cyan-950/20"
  ),
};
