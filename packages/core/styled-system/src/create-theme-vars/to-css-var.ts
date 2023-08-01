import type { WithCSSVar } from "../utils"

import { analyzeBreakpoints } from "@beae-ui/breakpoint-utils"
import { createThemeVars } from "./create-theme-vars"
import { extractSemanticTokens, extractTokens, omitVars } from "./theme-tokens"
import { flattenTokens } from "./flatten-tokens"

export function toCSSVar<T extends Record<string, any>>(rawTheme: T) {
  /**
   * In the case the theme has already been converted to css-var (e.g. extending the theme),
   * we can omit the computed css vars and recompute it for the extended theme.
   */
  const theme = omitVars(rawTheme)

  // omit components and breakpoints from css variable map
  const tokens = extractTokens(theme)
  const semanticTokens = extractSemanticTokens(theme)
  const flatTokens = flattenTokens({ tokens, semanticTokens })

  const cssVarPrefix = theme.config?.cssVarPrefix

  const {
    /**
     * This is more like a dictionary of tokens users will type `green.500`,
     * and their equivalent css variable.
     */
    cssMap,
    /**
     * The extracted css variables will be stored here, and used in
     * the emotion's <Global/> component to attach variables to `:root`
     */
    cssVars,
  } = createThemeVars(flatTokens, { cssVarPrefix })

  const defaultCssVars: Record<string, any> = {
    "--beae-ring-inset": "var(--beae-empty,/*!*/ /*!*/)",
    "--beae-ring-offset-width": "0px",
    "--beae-ring-offset-color": "#fff",
    "--beae-ring-color": "rgba(66, 153, 225, 0.6)",
    "--beae-ring-offset-shadow": "0 0 #0000",
    "--beae-ring-shadow": "0 0 #0000",
    "--beae-space-x-reverse": "0",
    "--beae-space-y-reverse": "0",
  }

  Object.assign(theme, {
    __cssVars: { ...defaultCssVars, ...cssVars },
    __cssMap: cssMap,
    __breakpoints: analyzeBreakpoints(theme.breakpoints),
  })

  return theme as WithCSSVar<T>
}
