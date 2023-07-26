import { classNames, useToggle } from "@beae-ui/utils"
import { PropType, defineComponent, h } from "vue"
const styles = {
  item: "connected-item",
  itemFocused: "connected-item-focused",
  itemPrimary: "connected-item-primary",
  itemConnection: "connected-item-connection",
}
type ItemPosition = "left" | "right" | "primary"

export interface ItemProps {
  /** Position of the item */
  position: ItemPosition
  /** Item content */
  //   children?: React.ReactNode; use slot
}

export const Item = defineComponent({
  props: {
    position: String as PropType<ItemProps["position"]>,
  },
  setup(props, { slots }) {
    const {
      value: focused,
      setTrue: forceTrueFocused,
      setFalse: forceFalseFocused,
    } = useToggle(false)

    const className = classNames(
      styles.item,
      focused && styles.itemFocused,
      props.position === "primary" ? styles.itemPrimary : styles.itemConnection,
    )

    return h(
      "div",
      {
        onBlur: forceFalseFocused,
        onFocus: forceTrueFocused,
        class: className,
      },
      slots.children?.(),
    )
  },
})
