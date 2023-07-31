import {
  HTMLBeaeProps,
  beae,
  ComponentWithProps,
  DeepPartial,
} from "@beae-ui/system"
import { defineComponent, h } from "vue"

interface CircleProps extends HTMLBeaeProps<"circle"> {}

export const Circle: ComponentWithProps<DeepPartial<CircleProps>> =
  defineComponent({
    name: "Circle",
    setup(props, {}) {
      return () =>
        h("circle", {
          cx: 50,
          cy: 50,
          r: 42,
          fill: "transparent",
          ...props,
        })
    },
  })
