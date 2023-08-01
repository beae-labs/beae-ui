import type { ThemeConfig, ThemeDirection } from "./theme.types"

import { components } from "./components"
import { foundations } from "./foundations"
import { semanticTokens } from "./semantic-tokens"
import { styles } from "./styles"

const direction: ThemeDirection = "ltr"

const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: "light",
  cssVarPrefix: "beae",
}

export const theme = {
  semanticTokens,
  direction,
  ...foundations,
  components,
  styles,
  config,
}

export type Theme = typeof theme

export * from "./theme.types"
export * from "./utils/is-beae-theme"

export default theme

export const baseTheme = {
  semanticTokens,
  direction,
  components: {},
  ...foundations,
  styles,
  config,
}
