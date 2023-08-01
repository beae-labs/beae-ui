import type { ThemingProps } from "@beae-ui/styled-system"
import type { ThemeExtension } from "../extend-theme"

import { isObject } from "@beae-ui/shared-utils"
import { mergeThemeOverride } from "../extend-theme"

export function withDefaultVariant({
  variant,
  components,
}: {
  variant: ThemingProps["variant"]
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
          const withVariant = {
            defaultProps: {
              variant,
            },
          }
          return [componentName, withVariant]
        }),
      ),
    })
  }
}
