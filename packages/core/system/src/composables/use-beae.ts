import type { ThemeOverride } from "@beae-ui/theme-utils"
import type { WithCSSVar } from "@beae-ui/styled-system"

import { inject } from "vue"
import { useColorMode } from "@beae-ui/color-mode"

/** Provides theme object in component context */
export const useTheme = <
  T extends WithCSSVar<ThemeOverride> = WithCSSVar<ThemeOverride>,
>(): T => {
  const theme = inject("$beaeTheme") as T
  return theme
}

/** Single hook to provide theme and color mode values */
export const useBeae = () => {
  const theme = useTheme()
  const { colorMode, forced } = useColorMode()
  return {
    theme,
    colorMode,
    forced,
  }
}
