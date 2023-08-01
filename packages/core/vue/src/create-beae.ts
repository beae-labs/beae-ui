import { computed, ref, UnwrapRef } from "vue"
import { localStorageManager } from "@beae-ui/color-mode"
import mergeWith from "lodash.mergewith"
import { theme as defaultTheme, baseTheme, Theme } from "@beae-ui/theme"
import { toCSSVar } from "@beae-ui/styled-system"
import { mode } from "@beae-ui/theme-tools"
import {
  injectGlobal,
  beae,
  createCache,
  beaeEmotionCache,
  domElements,
} from "@beae-ui/system"

import { setupColorModeContext } from "@beae-ui/color-mode"
import { injectResetStyles, injectThemeGlobalStyles } from "./helpers/css-reset"
import { EmotionCacheInjectionSymbol } from "@beae-ui/styled"

import internalIcons from "./icon.internals"
import { MergedIcons, parseIcons } from "./parse-icons"

// Type imports
import type { Plugin } from "vue"
import type { Dict } from "@beae-ui/utils"
import type { EmotionCache } from "@emotion/cache"
import type { WithCSSVar } from "@beae-ui/styled-system"
import type { ThemeOverride } from "@beae-ui/theme-utils"
import type { ColorModeRef } from "@beae-ui/color-mode"
import type { BeaePluginOptions } from "./helpers/plugin.types"

const defaultPluginOptions: BeaePluginOptions = {
  cssReset: true,
  isBaseTheme: false,
  colorModeManager: localStorageManager,
  experimental: {
    disableFactoryComponents: false,
  },
}

/**
 * Helper function to extend Beae plugin with options
 * It just returns its arguments with typescript types added
 */
export function extendBeae(options = defaultPluginOptions) {
  return options
}

export function createBeae(_options: BeaePluginOptions = {}) {
  const BeaeUIVuePlugin: Plugin = {
    install(app) {
      const options = mergeWith(
        {},
        defaultPluginOptions,
        _options,
      ) as BeaePluginOptions
      // 1. Get theme value
      // 2. Parse theme tokens to CSS variables
      // 3. Inject all CSS variables as theme object
      const theme =
        options.extendTheme! ||
        ((options.isBaseTheme ? baseTheme : defaultTheme) as any as
          | Theme
          | (Omit<Theme, "components"> & { components: Dict }))
      const computedTheme = computed<WithCSSVar<ThemeOverride>>(() =>
        toCSSVar(theme),
      )

      const colorModeManager = options.colorModeManager || localStorageManager
      // Inject Beae CSS variables
      injectGlobal({
        ":root": computedTheme.value.__cssVars,
      })

      // Initialize color mode
      const colorMode: UnwrapRef<ColorModeRef> =
        theme.config?.initialColorMode || "light"

      const colorModeRef = ref(colorMode) as ColorModeRef

      setupColorModeContext(app, {
        _colorMode: colorModeRef,
        colorModeManager,
        useSystemColorMode: theme.config?.useSystemColorMode || false,
        initialColorMode: colorMode,
        disableTransitionOnChange:
          theme.config?.disableTransitionOnChange || false,
      })

      if (options.cssReset) {
        injectResetStyles()
      }

      let libraryIcons = options.icons?.library || {}
      let extendedIcons = options.icons?.extend || {}

      // Bind theme to application global properties and provide to application
      app.config.globalProperties.$beaeTheme = computedTheme.value
      app.config.globalProperties.$beaeTheme = computedTheme.value
      app.provide("$beaeTheme", computedTheme.value as ThemeOverride)

      let emotionCache: EmotionCache
      // Provide emotion cache
      if (options.emotionCacheOptions) {
        emotionCache = createCache(options.emotionCacheOptions)
        app.provide(EmotionCacheInjectionSymbol, emotionCache)
      }

      emotionCache ||= beaeEmotionCache

      // Inject `styles.global` in document
      injectThemeGlobalStyles(computedTheme.value, emotionCache, colorModeRef)

      libraryIcons = parseIcons(libraryIcons)

      // Factory components
      if (!options.experimental?.disableFactoryComponents) {
        domElements.forEach((tag) => {
          app.component(`beae.${tag}`, beae(tag))
        })
      }

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

  return BeaeUIVuePlugin
}
