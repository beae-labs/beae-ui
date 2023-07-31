import { ComponentWithProps, DeepPartial, HTMLBeaeProps } from "@beae-ui/system"
import { defineComponent, h } from "vue"

export interface CircularProgressLabelProps extends HTMLBeaeProps<"div"> {}

/**
 * CircularProgress component label. In most cases it is a numeric indicator
 * of the circular progress component's value
 */
export const CircularProgressLabel: ComponentWithProps<
  DeepPartial<CircularProgressLabelProps>
> = defineComponent({
  name: "CircularProgressLabel",
  setup(_, { slots }) {
    return () =>
      h(
        "div",
        {
          style: {
            fontSize: "0.24em",
            top: "50%",
            left: "50%",
            width: "100%",
            textAlign: "center",
            position: "absolute",
            transform: "translate(-50%, -50%)",
          },
        },
        slots.default?.(),
      )
  },
})
