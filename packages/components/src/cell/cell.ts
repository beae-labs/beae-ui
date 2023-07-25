import { defineComponent, h } from "vue"
import { classNames } from "@beae-ui/utils"

type Breakpoints = "xs" | "sm" | "md" | "lg" | "xl"

type Cell = {
  [Breakpoint in Breakpoints]?: string
}

interface Columns {
  /** Number of columns the section should span on extra small screens */
  xs?: 1 | 2 | 3 | 4 | 5 | 6
  /** Number of columns the section should span on small screens */
  sm?: 1 | 2 | 3 | 4 | 5 | 6
  /** Number of columns the section should span on medium screens */
  md?: 1 | 2 | 3 | 4 | 5 | 6
  /** Number of columns the section should span on large screens */
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  /** Number of columns the section should span on extra large screens */
  xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
}

export interface CellProps {
  column?: Cell
  columnSpan?: Columns
  row?: Cell
}

export const Cell = defineComponent<CellProps>({
  setup({ columnSpan }, { slots }) {
    const className = classNames(
      "cell",
      columnSpan?.xs && `xs:col-span${columnSpan?.xs}`,
      columnSpan?.sm && `sm:col-span${columnSpan?.sm}`,
      columnSpan?.md && `md:col-span${columnSpan?.md}`,
      columnSpan?.lg && `lg:col-span${columnSpan?.lg}`,
      columnSpan?.xl && `xl:col-span${columnSpan?.xl}`,
    )

    return () => h("div", { class: className }, slots.default?.())
  },
})
