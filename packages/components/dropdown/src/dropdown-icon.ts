import {
  HTMLBeaeProps,
  beae,
  ComponentWithProps,
  DeepPartial,
  Children,
  cloneElement,
  isValidElement,
} from "@beae-ui/system"
import { useDropdownStyles } from "./dropdown"
import { defineComponent, h } from "vue"

export interface DropdownIconProps extends HTMLBeaeProps<"span"> {}
export const DropdownIcon: ComponentWithProps<DeepPartial<DropdownIconProps>> =
  defineComponent({
    setup(props, { attrs, slots }) {
      const styles = useDropdownStyles()
      const child = Children.only(slots.default && slots.default())
      const clone = isValidElement(child)
        ? cloneElement(child, {
            focusable: "false",
            "aria-hidden": true,
            class: "dropdown__icon",
          })
        : null

      const _className = "dropdown__icon-wrapper"
      return () =>
        h(
          beae.span,
          {
            class: _className,
            ...props,
            __css: styles.icon,
          },
          [clone],
        )
    },
  })

export default DropdownIcon
