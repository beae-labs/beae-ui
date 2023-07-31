import {
  ComponentWithProps,
  DeepPartial,
  HTMLBeaeProps,
  SystemStyleObject,
  beae,
} from "@beae-ui/system"

import { useProgressStyles } from "./progress"
import { defineComponent, h } from "vue"

export interface ProgressLabelProps extends HTMLBeaeProps<"div"> {}

/**
 * ProgressLabel is used to show the numeric value of the progress.
 * @see Docs https://beae-ui.com/progress
 */
export const ProgressLabel: ComponentWithProps<
  DeepPartial<ProgressLabelProps>
> = defineComponent({
  name: "ProgressLabel",
  setup(props, { slots }) {
    const styles = useProgressStyles()
    const labelStyles: SystemStyleObject = {
      top: "50%",
      left: "50%",
      width: "100%",
      textAlign: "center",
      position: "absolute",
      transform: "translate(-50%, -50%)",
      ...styles.value.label,
    }
    return () =>
      h(
        "div",
        {
          ...props,
          style: labelStyles,
        },
        slots.default?.(),
      )
  },
})
