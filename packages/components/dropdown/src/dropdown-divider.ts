import {
  HTMLBeaeProps,
  beae,
  ComponentWithProps,
  DeepPartial,
} from "@beae-ui/system"
import { useDropdownStyles } from "./dropdown"
import { defineComponent, h } from "vue"

export interface DropdownDividerProps extends HTMLBeaeProps<"hr"> {}

export const DropdownDivider: ComponentWithProps<
  DeepPartial<DropdownDividerProps>
> = defineComponent({
  setup(props, { attrs, slots }) {
    const styles = useDropdownStyles()
    return () =>
      h(beae.hr, {
        "aria-orientation": "horizontal",
        className: "dropdown__divider",
        ...attrs,
        __css: styles.divider,
      })
  },
})

export default DropdownDivider
