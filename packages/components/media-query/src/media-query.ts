/**
 * 📝 Notes for Contributors:
 *
 * - When creating an interactive component, we recommend consuming the
 * component hook created.
 *
 * For example, if you wanted to build an accordion component,
 * you'll first create a `useAccordion` hook and then create an `Accordion` component
 *
 * - Ensure this component is properly theme-able by following [this guide](https://ui.beae.com/docs/theming/component-style)
 *
 * - Ensure the component is composable and can adapt to multiple use-cases
 *
 * @see Guide https://ui.beae.com/guides/component-guide
 * @see Theming https://ui.beae.com/docs/theming/component-style
 */

import { useTheme } from "@beae-ui/system"

const getBreakpoint = (theme: Record<string, any>, value: any) => {
  return theme?.breakpoints?.[value] ?? value
}

export interface UseQueryProps {
  breakpoint?: string
  below?: string
  above?: string
}

export function useQuery(props: UseQueryProps) {
  const { breakpoint = "", below, above } = props

  const theme = useTheme()
  const bpBelow = getBreakpoint(theme, below)
  const bpAbove = getBreakpoint(theme, above)

  let query = breakpoint

  if (bpBelow) {
    query = `(max-width: ${bpBelow})`
  } else if (bpAbove) {
    query = `(min-width: ${bpAbove})`
  }

  return query
}
