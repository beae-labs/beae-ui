import type { ThemingProps } from "@beae-ui/styled-system"
import type { ThemeExtension } from "../extend-theme"

import { isObject } from "@beae-ui/shared-utils"
import { mergeThemeOverride } from "../extend-theme"

export function withDefaultColorScheme({
  colorScheme,
  components,
}: {
  colorScheme: ThemingProps["colorScheme"]
  components?: string[] | Record<string, any>
}): ThemeExtension {
  return (theme) => {
    let names = Object.keys(theme.components || {})

    if (Array.isArray(components)) {
      names = components
    } else if (isObject(components)) {
      names = Object.keys(components)
    }

    return mergeThemeOverride(theme, {
      components: Object.fromEntries(
        names.map((componentName) => {
          const withColorScheme = {
            defaultProps: {
              colorScheme,
            },
          }
          return [componentName, withColorScheme]
        }),
      ),
    })
  }
}
