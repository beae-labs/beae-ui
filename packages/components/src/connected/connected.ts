import { defineComponent, h } from "vue"
import { Item } from "./components"
const styles = {
  connected: "connected",
}
export interface ConnectedProps {
  /** Content to display on the left */
  //   left?: React.ReactNode; use slot
  /** Content to display on the right */
  //   right?: React.ReactNode; use slot
  /** Connected content */
  //   children?: React.ReactNode;  use slot
}

export const Connected = defineComponent({
  setup(_, { slots }) {
    const leftConnectionMarkup = slots.left?.()
      ? h(Item, { position: "left" }, slots.left?.())
      : null

    const rightConnectionMarkup = slots.right?.()
      ? h(Item, { position: "right" }, slots.right?.())
      : null

    return h(
      "div",
      {
        class: styles.connected,
      },
      [
        leftConnectionMarkup,
        h(Item, { position: "primary" }, slots.children?.()),
        rightConnectionMarkup,
      ],
    )
  },
})
