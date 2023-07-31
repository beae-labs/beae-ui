import { computed, Plugin, ref, UnwrapRef } from "vue"
import defaultTheme from "@beae-ui/theme"
import type { ColorModeRef } from "@beae-ui/color-mode"
import { toCSSVar, WithCSSVar, ThemingProps } from "@beae-ui/styled-system"
import { beae, injectGlobal } from "@beae-ui/system"
import {
  EmotionThemeContextSymbol,
  EmotionCacheInjectionSymbol,
} from "@beae-ui/styled"
import createCache, { EmotionCache } from "@emotion/cache"
import internalIcons from "./icon.internals"
import { extendTheme, ThemeOverride } from "./extend-theme"
import { MergedIcons, parseIcons } from "./parse-icons"
import { injectResetStyles, injectThemeGlobalStyles } from "./helpers/css-reset"
import { mode } from "@beae-ui/theme-tools"
import { BeaePluginOptions } from "./helpers/plugin.types"

/**
 * 1. Support passing cache options from plugin
 * 2. Provide emotion theme directly from plugin
 * 3.
 */

/**
 * Helper function to extend Beae plugin with options
 * It just returns its arguments with typescript types added
 */

export function extendBeae(options: BeaePluginOptions = { cssReset: true }) {
  return options
}

const BeaeUIVuePlugin: Plugin = {
  install(app, options: BeaePluginOptions = { cssReset: true }) {
    // 1. Get theme value
    // 2. Parse theme tokens to CSS variables
    // 3. Inject all CSS variables as theme object
    const theme = options.extendTheme || defaultTheme
    const computedTheme = computed<WithCSSVar<ThemeOverride>>(() =>
      toCSSVar(theme),
    )

    // Inject Beae CSS variables
    injectGlobal({
      ":root": computedTheme.value.__cssVars,
    })

    // Initialize color mode
    const colorMode: UnwrapRef<ColorModeRef> =
      theme.config?.initialColorMode || "light"

    // Provide initial color mode
    app.config.globalProperties.$initialColorMode = colorMode

    const colorModeRef = ref(colorMode) as ColorModeRef
    app.provide<ColorModeRef>("$beaeColorMode", colorModeRef)

    if (options.cssReset) {
      injectResetStyles()
    }

    let libraryIcons = options.icons?.library || {}
    let extendedIcons = options.icons?.extend || {}

    // Bind theme to application global properties and provide to application
    app.config.globalProperties.$beaeTheme = computedTheme.value
    app.config.globalProperties.$beaeTheme = computedTheme.value
    app.provide(EmotionThemeContextSymbol, computedTheme.value)
    app.provide("$beaeTheme", computedTheme.value as ThemeOverride)

    let emotionCache: EmotionCache | null = null
    // Provide emotion cache
    if (options.emotionCacheOptions) {
      emotionCache = createCache(options.emotionCacheOptions)
      app.provide(EmotionCacheInjectionSymbol, emotionCache)
    }

    if (!emotionCache) {
      emotionCache = createCache({
        key: "beae",
        nonce: `beae-global-cache-${Date.now()}`,
      })
    }

    // Inject `styles.global` in document
    injectThemeGlobalStyles(computedTheme.value, emotionCache, colorModeRef)

    libraryIcons = parseIcons(libraryIcons)

    // Merge internal icons and library icons
    const mergedIcons: MergedIcons = {
      ...internalIcons,
      ...libraryIcons,
      ...extendedIcons,
    }

    app.provide("$beaeIcons", mergedIcons)

    // Set color mode property
    app.config.globalProperties.$mode = mode
  },
}

export type { BeaePluginOptions }
export interface ThemeProviderProps extends ThemeOverride {}
export default BeaeUIVuePlugin
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
