import { defineComponent, h } from "vue"
import { usePopoverContext, useStyles } from "./popover.context"
import { type HTMLBeaeProps } from "@beae-ui/system"
import { PopoverDescription } from "./popover-description"

export interface PopoverBodyProps extends HTMLBeaeProps<"div"> {}
export const PopoverBody = defineComponent({
  name: "PopoverBody",
  setup(_, { slots, attrs }) {
    const api = usePopoverContext()

    const styles = useStyles()

    return () =>
      h(
        PopoverDescription,
        {
          ...attrs,
        },
        slots.default?.(),
      )
  },
})
