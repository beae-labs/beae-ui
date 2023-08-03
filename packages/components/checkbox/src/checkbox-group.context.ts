import { createContext } from "@beae-ui/utils/src/vue-utils"
import { type CheckboxGroupContext } from "./checkbox.types"

export const [CheckboxGroupProvider, useCheckboxGroupContext] =
  createContext<CheckboxGroupContext>({
    name: "CheckboxGroupContext",
    strict: false,
  })
