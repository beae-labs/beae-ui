import { Ref } from "vue"
import { isBrowser, noop } from "@beae-ui/utils"

const classNames = {
  light: "beae-ui-light",
  dark: "beae-ui-dark",
}

export type ColorMode = "light" | "dark" | "system"
export type ColorModeRef = Ref<"light" | "dark" | "system">

/**
 * SSR: Graceful fallback for the `body` element
 */
const mockBody = {
  classList: { add: noop, remove: noop },
}

const getBody = () => (isBrowser ? document.body : mockBody)

/**
 * Function to add/remove class from `body` based on color mode
 */
export function syncBodyClassName(isDark: boolean) {
  const body = getBody()
  body.classList.add(isDark ? classNames.dark : classNames.light)
  body.classList.remove(isDark ? classNames.light : classNames.dark)
}

/**
 * Check if JS media query matches the query string passed
 */
function getMediaQuery(query: string) {
  const mediaQueryList = window.matchMedia?.(query)
  if (!mediaQueryList) {
    return undefined
  }
  return !!mediaQueryList.media === mediaQueryList.matches
}

export const queries = {
  light: "(prefers-color-scheme: light)",
  dark: "(prefers-color-scheme: dark)",
}

export const lightQuery = queries.light
export const darkQuery = queries.dark

export function getColorScheme(fallback?: ColorModeRef) {
  const isDark = getMediaQuery(queries.dark) ?? fallback?.value === "dark"
  return isDark ? "dark" : "light"
}

/**
 * Adds system os color mode listener, and run the callback
 * once preference changes
 */
export function addListener(fn: Function) {
  if (!("matchMedia" in window)) {
    return noop
  }

  const mediaQueryList = window.matchMedia(queries.dark)

  const listener = () => {
    fn(mediaQueryList.matches ? "dark" : "light")
  }

  listener()
  mediaQueryList.addListener(listener)

  return () => {
    mediaQueryList.removeListener(listener)
  }
}

export const root = {
  get: () =>
    document.documentElement.style.getPropertyValue(
      "--beae-ui-color-mode",
    ) as ColorModeRef["value"],
  set: (mode: ColorModeRef) => {
    if (isBrowser) {
      document.documentElement.style.setProperty(
        "--beae-ui-color-mode",
        mode.value,
      )
    }
  },
}

type UtilOptions = {
  preventTransition?: boolean
}

export function getColorModeUtils(options: UtilOptions = {}) {
  const { preventTransition = true } = options

  const utils = {
    setDataset: (value: ColorMode) => {
      if (!globalThis?.document) return
      const cleanup = preventTransition ? utils.preventTransition() : undefined
      document.documentElement.dataset.theme = value
      document.documentElement.style.colorScheme = value
      cleanup?.()
    },
    setClassName(dark: boolean) {
      if (!globalThis?.document) return
      document.body.classList.add(dark ? classNames.dark : classNames.light)
      document.body.classList.remove(dark ? classNames.light : classNames.dark)
    },
    query() {
      if (!globalThis?.document) return
      return window.matchMedia("(prefers-color-scheme: dark)")
    },
    getSystemTheme(fallback?: ColorMode) {
      if (!globalThis?.document) return
      const dark = utils.query()!.matches ?? fallback === "dark"
      return dark ? "dark" : "light"
    },
    addListener(fn: (cm: ColorMode) => unknown) {
      const mql = utils.query()
      if (!globalThis?.document || !mql) return
      const listener = (e: MediaQueryListEvent) => {
        fn(e.matches ? "dark" : "light")
      }

      if (typeof mql.addListener === "function") mql.addListener(listener)
      else mql.addEventListener("change", listener)

      return () => {
        if (typeof mql.removeListener === "function")
          mql.removeListener(listener)
        else mql.removeEventListener("change", listener)
      }
    },
    preventTransition() {
      const css = document.createElement("style")
      css.appendChild(
        document.createTextNode(
          `*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`,
        ),
      )
      document.head.appendChild(css)

      return () => {
        // force a reflow
        ;(() => window.getComputedStyle(document.body))()

        // wait for next tick
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            document.head.removeChild(css)
          })
        })
      }
    },
  }

  return utils
}
