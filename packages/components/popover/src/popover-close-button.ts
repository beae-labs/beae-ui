import { defineComponent, h } from "vue"
import { useStyles } from "./popover.context"
import { CloseButton, type CloseButtonProps } from "@beae-ui/close-button"

export interface PopoverCloseButtonProps extends CloseButtonProps {}
export const PopoverCloseButton = defineComponent({
  name: "PopoverCloseButton",
  setup(_, { attrs }) {
    const styles = useStyles()

    return () =>
      h(CloseButton, {
        __label: "popover__close-button",
        size: "sm",
        __css: styles.value.closeButton,
        ...attrs,
      })
  },
})
