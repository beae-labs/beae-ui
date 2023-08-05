import { createContext } from "@beae-ui/vue-utils"
import { type ComputedRef } from "vue"
import { type UseRadioGroupReturn } from "./use-radio-group"
import { type ThemingProps } from "@beae-ui/styled-system"

export type RadioGroupContext = Pick<
  UseRadioGroupReturn,
  "value" | "name" | "isDisabled" | "isFocusable" | "onChange"
> &
  Omit<ThemingProps<"Radio">, "orientation"> & {}

export const [RadioGroupProvider, useRadioGroupContext] = createContext<
  ComputedRef<RadioGroupContext>
>({
  name: "RadioGroupContext",
  strict: false,
})
