import { defineComponent, h } from "vue"
import {
  // usePopoverContext,
  useStyles,
} from "./popover.context"
import { HTMLBeaeProps, beae } from "@beae-ui/system"

export interface PopoverPositionerProps extends HTMLBeaeProps<"div"> {}
export const PopoverPositioner = defineComponent({
  name: "PopoverPositioner",
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    // const api = usePopoverContext()

    const styles = useStyles()

    return () =>
      h(
        beae.div,
        {
          __label: "popover__popper",
          __css: styles.value.popper,
        },
        h(
          beae.div,
          {
            ...attrs,
          },
          slots.default?.(),
        ),
      )
  },
})
