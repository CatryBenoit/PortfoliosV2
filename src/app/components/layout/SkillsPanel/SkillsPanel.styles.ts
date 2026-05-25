// SkillsPanel.styles.ts

export const SKILLS_STYLES = {

  // CONTAINER
  container: `
    absolute
    top-1/2
    left-1/2
    transform
    -translate-x-1/2
    -translate-y-1/2

    z-[100]

    pointer-events-auto

    font-mono
  `,

  // MAIN PANEL
  panel: `
    w-[1350px]
    md:w-[1500px]

    p-12

    border-2
    border-cyan-400

    bg-[#070b14]

    relative

    shadow-[0_0_40px_rgba(34,211,238,0.3)]
  `,

  // HEADER
  header: `
    flex
    justify-between
    items-center

    mb-10

    border-b-2
    border-cyan-500/50

    pb-5
  `,

  headerSubtitle: `
    text-[10px]
    text-cyan-400

    tracking-[0.3em]

    flex
    items-center
    gap-2

    mb-1

    font-bold
  `,

  headerTitle: `
    text-white

    font-extrabold
    text-3xl

    uppercase

    tracking-tight

    text-glitch
  `,

  // CLOSE BUTTON
  closeBtn: `
    p-2

    text-cyan-400

    border
    border-cyan-500/30

    transition-all

    hover:text-red-400
    hover:bg-red-500/20
    hover:border-red-500/50
  `,

  // LIST CONTAINER
  listContainer: `
    space-y-10
  `,

  // SKILL BLOCK
  skillRow: `
    space-y-4

    py-3
  `,

  // TOP INFO
  skillInfo: `
    flex
    justify-between
    items-center

    text-sm
    text-white

    font-bold

    uppercase

    tracking-[0.2em]
  `,

  skillLabel: `
    flex
    items-center
    gap-3
  `,

  skillPercent: `
    text-cyan-400

    font-black

    tracking-widest
  `,

  // PROGRESS BAR
  progressBarContainer: `
    h-3

    bg-slate-900/70

    p-0.5

    rounded-sm

    overflow-hidden
  `,

  progressBarFill: `
    h-full

    bg-cyan-400

    rounded-sm

    shadow-[0_0_12px_rgba(34,211,238,0.7)]

    transition-all
    duration-500
  `,

  // TERMINAL FOOTER
  terminalLog: `
    mt-10

    p-5

    bg-cyan-950/20

    border
    border-cyan-500/20

    text-[10px]

    text-cyan-200/60

    italic

    leading-loose

    uppercase

    tracking-[0.15em]
  `
};