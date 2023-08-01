import type { ComputedRef, Ref } from "vue"
import type { Theme } from "@beae-ui/theme"
import type { SystemStyleObject, ThemingProps } from "@beae-ui/styled-system"

import { computed } from "vue"
import { filterUndefined, get, mergeWith, runIfFn } from "@beae-ui/utils"
import { useBeae } from "./use-beae"

export function useStyleConfig<Component extends keyof Theme["components"]>(
  themeKey: Component,
  themingProps: ThemingProps,
  options: { isMultiPart: true },
): ComputedRef<Record<string, SystemStyleObject>>

export function useStyleConfig<Component extends keyof Theme["components"]>(
  themeKey: Component,
  themingProps: Ref<ThemingProps>,
  options: { isMultiPart: true },
): ComputedRef<Record<string, SystemStyleObject>>

export function useStyleConfig<Component extends keyof Theme["components"]>(
  themeKey: Component,
  themingProps?: ThemingProps,
  options?: { isMultiPart?: boolean },
): ComputedRef<SystemStyleObject>

export function useStyleConfig<Component extends keyof Theme["components"]>(
  themeKey: Component,
  themingProps?: Ref<ThemingProps>,
  options?: { isMultiPart?: boolean },
): ComputedRef<SystemStyleObject>

export function useStyleConfig<Component extends keyof Theme["components"]>(
  themeKey: Component,
  themingProps: any,
  options: any = {},
) {
  return computed(() => {
    const { styleConfig: styleConfigProp, ...rest } =
      themingProps.value || themingProps
    const { theme, colorMode } = useBeae()
    const themeStyleConfig = get(theme, `components.${themeKey}`)

    const styleConfig = styleConfigProp || themeStyleConfig
    const mergedProps = mergeWith(
      { theme: theme, colorMode: colorMode.value },
      styleConfig?.defaultProps ?? {},
      filterUndefined(rest),
    )

    const baseStyles = runIfFn(styleConfig?.baseStyle ?? {}, mergedProps)
    const variants = runIfFn(
      styleConfig?.variants?.[mergedProps.variant] ?? {},
      mergedProps,
    )

    const sizes = runIfFn(
      styleConfig?.sizes?.[mergedProps.size] ?? {},
      mergedProps,
    )

    type ComponentStyles = SystemStyleObject | Record<string, SystemStyleObject>
    const styles = mergeWith({}, baseStyles, sizes, variants) as ComponentStyles

    if (options.isMultiPart && styleConfig?.parts) {
      styleConfig?.parts?.forEach((part: keyof ComponentStyles) => {
        //@ts-ignore
        styles[part] = styles[part] ?? {}
      })
    }

    return styles as Theme["components"][Component]
  })
}

export function useMultiStyleConfig<
  AnatomyParts extends readonly string[],
  Component extends keyof Theme["components"] = any,
>(themeKey: Component, themingProps: any) {
  return useStyleConfig(themeKey, themingProps, {
    isMultiPart: true,
  }) as ComputedRef<{
    [K in AnatomyParts[number]]: SystemStyleObject
  }>
}
