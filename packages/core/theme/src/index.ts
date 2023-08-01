import { components } from "./components"
import foundations, { ColorHues } from "./foundations"
import { semanticTokens } from "./semantic-tokens"
import styles from "./styles"
import { ThemeDirection } from "./theme.types"

const direction: ThemeDirection = "ltr"

export type ColorMode = "light" | "dark"

export interface ColorModeOptions {
  initialColorMode?: ColorMode
  useSystemColorMode?: boolean
  cssVarPrefix?: string
}

/**
 * Color mode config
 */
const config: ColorModeOptions = {
  useSystemColorMode: false,
  initialColorMode: "light",
  cssVarPrefix: "beae",
}

export const theme = {
  ...foundations,
  components,
  styles,
  config,
}

export type Theme = typeof theme
export * from "./theme.types"
export * from "./utils/is-beae-theme"
export type { ColorHues }

export default theme

export const baseTheme = {
  semanticTokens,
  direction,
  components: {},
  ...foundations,
  styles,
  config,
}
