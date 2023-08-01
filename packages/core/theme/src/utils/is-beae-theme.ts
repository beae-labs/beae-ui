import { isObject } from "@beae-ui/utils"
import type { BeaeTheme } from "../theme.types"

export const requiredBeaeThemeKeys: (keyof BeaeTheme)[] = [
  "borders",
  "breakpoints",
  "colors",
  "components",
  "config",
  "direction",
  "fonts",
  "fontSizes",
  "fontWeights",
  "letterSpacings",
  "lineHeights",
  "radii",
  "shadows",
  "sizes",
  "space",
  "styles",
  "transition",
  "zIndices",
]

export function isBeaeTheme(unit: unknown): unit is BeaeTheme {
  if (!isObject(unit)) {
    return false
  }

  return requiredBeaeThemeKeys.every((propertyName) =>
    Object.prototype.hasOwnProperty.call(unit, propertyName),
  )
}
