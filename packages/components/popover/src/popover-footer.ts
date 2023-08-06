import { defineComponent, h } from "vue"
import { usePopoverContext, useStyles } from "./popover.context"
import { HTMLBeaeProps, beae } from "@beae-ui/system"

export interface PopoverFooterProps extends HTMLBeaeProps<"div"> {}
export const PopoverFooter = defineComponent({
  name: "PopoverFooter",
  setup(_, { slots, attrs }) {
    const api = usePopoverContext()
    const styles = useStyles()

    return () =>
      h(
        beae.footer,
        {
          __label: "popover__footer",
          __css: styles.value.footer,
          ...attrs,
        },
        slots.default?.(),
      )
  },
})
