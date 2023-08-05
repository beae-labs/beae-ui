import { createContext } from "@beae-ui/vue-utils"
import { type ThemingProps } from "@beae-ui/styled-system"
import { type UseCheckboxGroupReturn } from "./use-checkbox-group"
import { type ComputedRef } from "vue"

export type CheckboxGroupContext = Pick<
  UseCheckboxGroupReturn,
  "value" | "isDisabled" | "onChange"
> &
  Omit<ThemingProps<"Radio">, "orientation"> & {}

export const [CheckboxGroupProvider, useCheckboxGroupContext] = createContext<
  ComputedRef<CheckboxGroupContext>
>({
  name: "CheckboxGroupContext",
  strict: false,
})
