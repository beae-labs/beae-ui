import { defineComponent, h } from "vue"
import { type HTMLBeaeProps } from "@beae-ui/system"
import { PopoverDescription } from "./popover-description"

export interface PopoverBodyProps extends HTMLBeaeProps<"div"> {}
export const PopoverBody = defineComponent({
  name: "PopoverBody",
  setup(_, { slots, attrs }) {
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
