import {
  // ColorMode,
  // ColorModeContext,
  // ThemeProvider,
  useBeae,
} from "@beae-ui/system"
import defaultTheme from "@beae-ui/theme"
import { ToastProvider, ToastProviderProps } from "./toast.provider"
import { UseToastOptions } from "./use-toast"
import { createToastFn, CreateToastFnReturn } from "./toast"
import { ComputedRef, h } from "vue"

const defaults: UseToastOptions = {
  duration: 5000,
  variant: "solid",
}

export interface CreateStandAloneToastParam
  extends Partial<
      ReturnType<typeof useBeae> & {
        setColorMode: (value: ColorMode) => void
        defaultOptions: UseToastOptions
      }
    >,
    Omit<ToastProviderProps, "children"> {}

export const defaultStandaloneParam: CreateStandAloneToastParam &
  Required<Omit<CreateStandAloneToastParam, keyof ToastProviderProps>> = {
  theme: defaultTheme,
  colorMode: "light",
  toggleColorMode: () => {},
  setColorMode: () => {},
  defaultOptions: defaults,
  forced: false,
}

export type CreateStandaloneToastReturn = {
  toast: CreateToastFnReturn
}

type colorModeContextValueType = {
  colorMode: ComputedRef<"dark" | "light"> | undefined
  setColorMode: ((value: ColorMode) => void) | undefined
  toggleColorMode: ToastProviderProps
  forced: boolean | undefined
}
/**
 * Create a toast
 */
export function createStandaloneToast({
  theme = defaultStandaloneParam.theme,
  colorMode = defaultStandaloneParam.colorMode,
  toggleColorMode = defaultStandaloneParam.toggleColorMode,
  setColorMode = defaultStandaloneParam.setColorMode,
  defaultOptions = defaultStandaloneParam.defaultOptions,
  motionVariants,
  toastSpacing,
  component,
  forced,
}: CreateStandAloneToastParam = defaultStandaloneParam): CreateStandaloneToastReturn {
  // const colorModeContextValue: colorModeContextValueType = {
  //   colorMode,
  //   setColorMode,
  //   toggleColorMode,
  //   forced,
  // }
  // ThemeProvider({theme: theme});
  // <ColorModeContext.Provider value={colorModeContextValue}>
  // ColorModeContext(colorModeContextValue);
  console.log("initssss")
  return {
    ToastContainer: () =>
      h(ToastProvider, {
        aultOptions: defaultOptions,
        motionVariants: motionVariants,
        toastSpacing: toastSpacing,
        component: component,
      }),
    toast: createToastFn(theme.direction, defaultOptions),
  }
}
