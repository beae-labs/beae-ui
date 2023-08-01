import { StorageManager } from "@beae-ui/color-mode"
import { ThemeOverride } from "../extend-theme"
import { Options } from "@emotion/cache"

interface ExtendIconsPath {
  path: string
  viewBox?: string
}

interface IconsOptions {
  pack?: "fa" | "fe"
  library?: {}
  extend?: Record<string, ExtendIconsPath>
}

export interface ExperimentalOptions {
  disableFactoryComponents?: boolean
}

export interface BeaePluginOptions {
  cssReset?: boolean
  extendTheme?: ThemeOverride
  icons?: IconsOptions
  isBaseTheme?: boolean
  emotionCacheOptions?: Options
  colorModeManager?: StorageManager
  experimental?: ExperimentalOptions
}
