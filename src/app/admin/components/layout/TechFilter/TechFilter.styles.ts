// TechFilter.styles.ts
import { SCANNER, cx } from "../theme";

export const TECHFILTER_STYLES = {
  wrapper: "w-full h-full flex-1 min-h-0 font-mono pointer-events-auto flex flex-col",
  box: cx(SCANNER.box, "h-full flex-1 min-h-0"),
  header: SCANNER.header,
  headerLabel: SCANNER.headerLabel,
  headerCount: SCANNER.headerCount,
  list: cx(SCANNER.list, "flex-1 min-h-0 overflow-y-auto hud-scrollbar"),
  item: SCANNER.item,
  itemArrow: SCANNER.itemArrow,
};
