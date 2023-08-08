import { defineComponent, h } from "vue"
import {
  // usePopoverContext,
  useStyles,
} from "./popover.context"
import { type HTMLBeaeProps, beae } from "@beae-ui/system"

export interface PopoverDescriptionProps extends HTMLBeaeProps<"div"> {}
export const PopoverDescription = defineComponent({
  name: "PopoverDescription",
  setup(_, { slots, attrs }) {
    // const api = usePopoverContext()

    const styles = useStyles()

    return () =>
      h(
        beae.div,
        {
          __label: "popover__body",
          __css: styles.value.body,
          ...attrs,
        },
        slots.default?.(),
      )
  },
})
