import { ThemingProps } from "@beae-ui/styled-system"
import { beae } from "@beae-ui/system"
import { extendTheme, ThemeOverride } from "./extend-theme"
import { BeaePluginOptions } from "./helpers/plugin.types"

/**
 * Helper function to extend Beae plugin with options
 * It just returns its arguments with typescript types added
 */

export function extendBeae(options: BeaePluginOptions = { cssReset: true }) {
  return options
}

export { createBeae } from "./create-beae"
export type { BeaePluginOptions }
export interface ThemeProviderProps extends ThemeOverride {}
export { extendTheme }

// Export beae factory function
export { beae }

export type { ThemingProps }

/**
 *
 * Component exports
 * ==================
 *
 * Dear contributors,
 *
 * Please keep these exports in Alphabetical order :)
 */

// A

// B
export * from "@beae-ui/button"

// C
export * from "@beae-ui/checkbox"
export * from "@beae-ui/close-button"
export * from "@beae-ui/css-reset"
export * from "@beae-ui/color-mode"

// F
export * from "@beae-ui/focus-lock"
export * from "@beae-ui/form-control"

// I
export * from "@beae-ui/icon"
export * from "@beae-ui/input"

// L
export * from "@beae-ui/layout"

// M
export * from "@beae-ui/modal"
export * from "@beae-ui/motion"

// P
export * from "@beae-ui/pin-input"
export * from "@beae-ui/portal"

// R
export * from "@beae-ui/radio"

// S
export * from "@beae-ui/spinner"

// T
export * from "@beae-ui/theme-provider"

// V
export * from "@beae-ui/visually-hidden"

// OTHERS
export * from "@beae-ui/composables"
export * from "@beae-ui/vue-a11y"

/**
 *
 * Directives exports
 * ==================
 *
 * Dear contributors,
 *
 * Please keep these exports in Alphabetical order :)
 */
