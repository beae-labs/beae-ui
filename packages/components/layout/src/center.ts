import { type PropType, defineComponent, h } from "vue"
import { type HTMLBeaeProps, type DOMElements, beae } from "@beae-ui/system"

export interface CenterProps extends HTMLBeaeProps<"div"> {}

/**
 * Vue component used to horizontally and vertically center its child.
 * It uses the popular `display: flex` centering technique.
 *
 * @see Docs https://vue.beae-ui.com/docs/layout/center
 */
export const Center = defineComponent({
  name: "Center",
  props: {
    as: {
      type: [String, Object] as PropType<DOMElements>,
      default: "div",
    },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        beae.div,
        {
          __label: "center",
          __css: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          ...props,
          ...attrs,
        },
        slots,
      )
  },
})
