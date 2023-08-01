import { computed, UnwrapRef, type Plugin, ref } from "vue"

import { Dict, mergeWith } from "@beae-ui/utils"
import {
  ColorModeRef,
  localStorageManager,
  setupColorModeContext,
} from "@beae-ui/color-mode"
import { Theme, baseTheme, theme as defaultTheme } from "@beae-ui/theme"
import { toCSSVar, WithCSSVar } from "@beae-ui/styled-system"
import {
  beae,
  beaeEmotionCache,
  domElements,
  injectGlobal,
} from "@beae-ui/system"
import { EmotionCache } from "@emotion/utils"
import createCache from "@emotion/cache"
import { EmotionCacheInjectionSymbol } from "@beae-ui/styled"

import { MergedIcons, parseIcons } from "./parse-icons"
import { injectResetStyles, injectThemeGlobalStyles } from "./helpers/css-reset"
import internalIcons from "./icon.internals"
import { BeaePluginOptions } from "./helpers/plugin.types"
import { ThemeOverride } from "./extend-theme"
import { mode } from "@beae-ui/theme-tools"

const defaultPluginOptions: BeaePluginOptions = {
  cssReset: true,
  isBaseTheme: false,
  colorModeManager: localStorageManager,
  experimental: {
    disableFactoryComponents: false,
  },
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
          // TODO: Make this function on later
          // @ts-ignore
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

      // app.provide(ToastContextSymbol, toastContext)

      // Setup toast container component
      // if (canUseDOM()) {
      //   const toastContainer =
      //     document.getElementById(ToastContainerId) ||
      //     document.createElement("div")
      //   toastContainer.id = ToastContainerId
      //   toastContainer.setAttribute("data-beae-toast-container", "")

      //   if (!document.body.contains(toastContainer)) {
      //     document.body.insertAdjacentElement("afterend", toastContainer)
      //   }

      //   const vnode = createVNode(CToastContainer)
      //   vnode.appContext = app._context
      //   render(vnode, toastContainer)
      // }
    },
  }

  return BeaeUIVuePlugin
}
