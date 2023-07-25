import { classNames } from "@beae-ui/utils"
import { PropType, defineComponent, h } from "vue"

const styles = {
  Text: "text",
  Label: "label",
  hidden: "hidden",
  RequiredIndicator: "RequiredIndicator",
}

export interface LabelProps {
  /** Label content */
  /** A unique identifier for the label */
  id: string
  /** Visually hide the label */
  hidden?: boolean
  /** Visual required indicator for the label */
  requiredIndicator?: boolean
}

export function labelID(id: string) {
  return `${id}Label`
}

export const Label = defineComponent({
  props: {
    id: String as PropType<LabelProps["id"]>,
    hidden: Boolean as PropType<LabelProps["hidden"]>,
    requiredIndicator: Boolean as PropType<LabelProps["requiredIndicator"]>,
  },
  setup(props, { slots }) {
    const className = classNames(styles.Label, props.hidden && styles.hidden)

    return () =>
      h(
        "div",
        {
          class: className,
        },
        h(
          "label",
          {
            id: labelID(props.id),
            for: props.id,
            class: classNames(
              styles.Text,
              props.requiredIndicator && styles.RequiredIndicator,
            ),
          },
          slots.children?.(),
        ),
      )
  },
})
