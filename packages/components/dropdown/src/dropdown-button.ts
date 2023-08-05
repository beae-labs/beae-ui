import {
  HTMLBeaeProps,
  beae,
  DeepPartial,
  ComponentWithProps,
} from "@beae-ui/system"
import { useDropdownStyles } from "./dropdown"
import { useDropdownButton } from "./use-dropdown"
import { defineComponent, h, PropType } from "vue"

export interface DropdownButtonProps extends HTMLBeaeProps<"button"> {
  as: [Object, String]
}

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
          ...styles.value,
        },
      })
  },
})

const DropdownButton: ComponentWithProps<DeepPartial<DropdownButtonProps>> =
  defineComponent({
    props: {
      as: {
        type: [Object, String] as PropType<DropdownButtonProps["as"]>,
        default: "button",
      },
    },
    setup(props, { attrs, slots }) {
      const buttonProps = useDropdownButton(props, attrs)
      const Element = props?.as || StyledDropdownButton

      return () =>
        h(
          Element,
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
