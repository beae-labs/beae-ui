import {
  HTMLBeaeProps,
  beae,
  ComponentWithProps,
  DeepPartial,
} from "@beae-ui/system"
import { useDropdownStyles } from "./dropdown"
import { defineComponent, h } from "vue"

export interface DropdownCommandProps extends HTMLBeaeProps<"span"> {}

export const DropdownCommand: ComponentWithProps<
  DeepPartial<DropdownCommandProps>
> = defineComponent({
  setup(_props, { attrs, slots }) {
    const styles = useDropdownStyles()
    return () =>
      h(beae.span, {
        __css: styles.value,
        ...attrs,
      })
  },
})

export default DropdownCommand
