import { type ComputedRef } from "vue"
import { type AnyFn, createContext } from "@beae-ui/vue-utils"
import { type AnatomyParts, createStylesContext } from "@beae-ui/system"

export interface UsePopoverContext {
  wait: AnyFn
  trigger: "click" | "hover"
}

export const [PopoverProvider, usePopoverContext] = createContext<
  ComputedRef<UsePopoverContext>
>({
  name: "CPopoverContext",
  strict: true,
  errorMessage:
    "usePopoverContext: `context` is undefined. Seems you forgot to wrap Popover child components inside the `<Popover />` component",
})

export const [PopoverStylesProvider, useStyles] =
  createStylesContext<AnatomyParts.Popover>("Popover")
