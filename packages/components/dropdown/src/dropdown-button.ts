import {
  HTMLBeaeProps,
  beae,
  DeepPartial,
  ComponentWithProps,
} from "@beae-ui/system"
import { useDropdownStyles } from "./dropdown"
import { useDropdownButton } from "./use-dropdown-button"
import { defineComponent, h } from "vue"

export interface DropdownButtonProps extends HTMLBeaeProps<"button"> {}

const StyledDropdownButton: ComponentWithProps<
  DeepPartial<DropdownButtonProps>
> = defineComponent({
  setup(_props, { attrs, slots }) {
    const styles = useDropdownStyles()
    return () =>
      h(beae.button, {
        ...attrs,
        ..._props,
        __css: {
          display: "inline-flex",
          appearance: "none",
          alignItems: "center",
          outline: 0,
          ...styles.button,
        },
      })
  },
})

export const DropdownButton: ComponentWithProps<
  DeepPartial<DropdownButtonProps>
> = defineComponent({
  setup(props, { attrs, slots }) {
    const buttonProps = useDropdownButton(props)

    return () =>
      h(
        StyledDropdownButton,
        {
          ...buttonProps,
        },
        h(
          beae.span,
          {
            __css: { pointerEvents: "none", flex: "1 1 auto", minW: 0 },
          },
          [slots?.default?.()],
        ),
      )
  },
})

export default DropdownButton
