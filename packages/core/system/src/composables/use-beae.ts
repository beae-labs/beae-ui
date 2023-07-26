import { inject } from "vue"
import { useColorMode } from "@beae-ui/color-mode"
import { Dict } from "@beae-ui/utils"

/** Provides theme object in component context */
export const useTheme = <T extends object = Dict>(): T => {
  const theme = inject("$beaeTheme") as T

  return theme
}

/** Single hook to provide theme and color mode values */
export const useBeae = () => {
  const theme = useTheme()
  const { colorMode } = useColorMode()
  return {
    theme,
    colorMode,
  }
}
