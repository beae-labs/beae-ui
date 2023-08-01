import { __DEV__ } from "@beae-ui/utils"
import {
  Ref,
  computed,
  defineComponent,
  inject,
  provide,
  ref,
  renderSlot,
  watch,
  watchEffect,
} from "vue"
import { ColorMode, ColorModeRef, getColorModeUtils } from "./color-mode.utils"
import { mountColorModeScript } from "./color-mode-script"
import { StorageManager } from "./storage-manager"

export type { ColorModeRef }

export interface ColorModeOptions {
  initialColorMode?: ColorModeRef
  useSystemColorMode?: boolean
}

export type ColorModeContext = {
  colorMode: ColorModeRef
  toggleColorMode: () => void
}

export interface IColorModeContext {
  colorMode: ColorModeRef
  toggleColorMode: () => void
  forced?: boolean
}

interface SetupColorModeContext {
  _colorMode: ColorModeRef
  colorModeManager: StorageManager
  useSystemColorMode?: boolean
  disableTransitionOnChange?: boolean
  initialColorMode?: ColorMode
}

export interface InternalColorModeContext {
  colorModeManager: StorageManager
  toggleColorMode(): void
  colorMode: Ref<Exclude<ColorMode, "system">>
  useSystemColorMode?: boolean
  disableTransitionOnChange?: boolean
  initialColorMode?: ColorMode
}

export const AppColorModeContextSymbol = Symbol("AppColorModeContextSymbol")

function getTheme(manager: StorageManager, fallback?: ColorMode) {
  return manager.type === "cookie" && manager.ssr
    ? manager.get(fallback)
    : fallback
}

export function setupColorModeContext(
  app: any,
  {
    _colorMode,
    colorModeManager,
    useSystemColorMode,
    disableTransitionOnChange,
    initialColorMode,
  }: SetupColorModeContext,
) {
  mountColorModeScript({
    initialColorMode: _colorMode.value,
    type: colorModeManager.type,
  })

  const colorMode = computed({
    get: () =>
      (getTheme(colorModeManager, _colorMode.value) as Exclude<
        ColorMode,
        "system"
      >) || (_colorMode.value as Exclude<ColorMode, "system">),
    set: (value: Exclude<ColorMode, "system">) => {
      _colorMode.value = value
    },
  })

  const utils = computed(() =>
    getColorModeUtils({ preventTransition: disableTransitionOnChange }),
  )

  const managerValue = colorModeManager.get()

  // If this is SSR, we check to see if the cookie has been specified.
  // Otherwise we should bail.
  if (
    // Is SSR
    typeof document !== "undefined" &&
    document.documentElement.dataset.beaeUiSsr === "true"
    // !initialColorMode
  ) {
    // Bail and
    // Forcefully hydrate client to match color mode
    const ssrColorMode = document.documentElement.dataset.theme
    if (ssrColorMode) {
      console.debug("beae-ui-ssr color mode is", ssrColorMode)
      setColorMode(ssrColorMode as ColorMode)
    }
  } else if (managerValue) {
    setColorMode(managerValue)
  } else if (initialColorMode === "system") {
    setColorMode("system")
  } else {
    setColorMode(colorMode.value)
  }

  function setColorMode(value: ColorMode | "system") {
    const { setClassName, setDataset, getSystemTheme } = utils.value
    const resolved = value === "system" ? getSystemTheme()! : value
    colorMode.value = resolved

    setClassName(resolved === "dark")
    setDataset(resolved)

    colorModeManager.set(resolved)
  }

  const toggleColorMode = () => {
    if (colorMode.value === "light") {
      setColorMode("dark")
    } else {
      setColorMode("light")
    }
  }

  watch(
    () => useSystemColorMode,
    (nextUseSystemColorMode) => {
      if (typeof document !== "undefined") {
        if (!nextUseSystemColorMode) return
        return utils.value.addListener(setColorMode)
      }
    },
    {
      immediate: true,
    },
  )

  app.provide(AppColorModeContextSymbol, {
    colorMode: computed(() => colorMode.value),
    toggleColorMode,
    forced: false,
  })
}

/**
 * Injects color mode into component instance
 */
export const useColorMode = () => {
  const context = inject<IColorModeContext>(AppColorModeContextSymbol, {
    colorMode: computed(() => "light" as Exclude<ColorMode, "system">),
    toggleColorMode: () => {},
  })

  return {
    forced: context.forced,
    colorMode: computed(
      () => context.colorMode.value as Exclude<ColorMode, "system">,
    ),
    toggleColorMode: context.toggleColorMode,
  }
}

/**
 * Change value based on color mode.
 *
 * @param lightValue the light mode value
 * @param darkValue the dark mode value
 *
 * @example
 *
 * ```js
 * const Icon = useColorModeValue(MoonIcon, SunIcon)
 * ```
 */
export function useColorModeValue<TLight = unknown, TDark = unknown>(
  lightValue: TLight,
  darkValue: TDark,
) {
  const { colorMode } = useColorMode()
  const modeValue = ref()

  watchEffect(() => {
    modeValue.value = colorMode.value === "dark" ? darkValue : lightValue
  })

  return modeValue
}

export const DarkMode = defineComponent({
  name: "DarkMode",
  setup(_, { slots }) {
    provide(AppColorModeContextSymbol, {
      colorMode: computed(() => "dark" as Exclude<ColorMode, "system">),
      toggleColorMode: () => {},
      forced: true,
    })

    return () => renderSlot(slots, "default")
  },
})

export const LightMode = defineComponent({
  name: "LightMode",
  setup(_, { slots, attrs }) {
    provide(AppColorModeContextSymbol, {
      colorMode: computed(() => "light" as Exclude<ColorMode, "system">),
      toggleColorMode: () => {},
      forced: true,
    })

    return () => renderSlot(slots, "default")
  },
})
