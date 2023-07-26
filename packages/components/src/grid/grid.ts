import { PropType, defineComponent, h } from "vue"
import { classNames } from "@beae-ui/utils"

type Breakpoints = "xs" | "sm" | "md" | "lg" | "xl"

type Columns = {
  [Breakpoint in Breakpoints]?: number
}

type Gap = {
  [Breakpoint in Breakpoints]?: string
}

export interface GridProps {
  /* Number of columns */
  columns?: Columns
  /* Grid gap */
  gap?: Gap
}

const _gridProps = {
  columns: {
    type: Object as PropType<GridProps["columns"]>,
    require: false,
  },
  gap: {
    type: Object as PropType<GridProps["gap"]>,
    require: false,
  },
}

export const Grid = defineComponent({
  props: _gridProps,
  setup({ columns, gap }, { slots }) {
    const className = classNames(
      "grid",
      columns?.xs && `xs:grid-cols-${columns?.xs}`,
      columns?.sm && `sm:grid-cols-${columns?.sm}`,
      columns?.md && `md:grid-cols-${columns?.md}`,
      columns?.lg && `lg:grid-cols-${columns?.lg}`,
      columns?.xl && `xl:grid-cols-${columns?.xl}`,
      gap?.xs && `xs:gap-${gap?.xs}`,
      gap?.sm && `sm:gap-${gap?.sm}`,
      gap?.md && `md:gap-${gap?.md}`,
      gap?.lg && `lg:gap-${gap?.lg}`,
      gap?.xl && `xl:gap-${gap?.xl}`,
    )

    return () =>
      h(
        "div",
        {
          class: className,
        },
        slots.default?.(),
      )
  },
})
