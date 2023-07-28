import { defineComponent, h, PropType } from "vue"
import {
  beae,
  HTMLBeaeProps,
  ComponentWithProps,
  DeepPartial,
  DOMElements,
} from "@beae-ui/system"

export interface CCenterProps extends HTMLBeaeProps<"div"> {}

/**
 * Vue component used to horizontally and vertically center its child.
 * It uses the popular `display: flex` centering technique.
 *
 * @see Docs https://vue.beae-ui.com/docs/layout/center
 */
export const LCenter: ComponentWithProps<DeepPartial<CCenterProps>> =
  defineComponent({
    name: "LCenter",
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
