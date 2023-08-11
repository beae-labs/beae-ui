import {
  HTMLBeaeProps,
  beae,
  ComponentWithProps,
  DeepPartial,
} from "@beae-ui/system"
import { useDropdownStyles } from "./dropdown"
import { defineComponent, h } from "vue"

export interface DropdownIconProps extends HTMLBeaeProps<"span"> {}

export const DropdownIcon: ComponentWithProps<DeepPartial<DropdownIconProps>> =
  defineComponent({
    setup(props, { attrs, slots }) {
      const styles = useDropdownStyles()
      return () =>
        h(
          beae.span,
          {
            __css: styles.item,
            ...attrs,
          },
          [
            slots?.default?.({
              focusable: "false",
              "aria-hidden": true,
            }),
          ],
        )
    },
  })

export default DropdownIcon
