import { HTMLBeaeProps } from "@beae-ui/system"

import { rotate } from "./progress.utils"
import { PropType, defineComponent, h } from "vue"

interface ShapeProps extends HTMLBeaeProps<"svg"> {
  size?: string | number
  /**
   * @default false
   */
  isIndeterminate?: boolean
}

export const Shape = defineComponent({
  name: "Shape",
  props: {
    size: String as PropType<ShapeProps["size"]>,
    isIndeterminate: Boolean as PropType<ShapeProps["isIndeterminate"]>,
  },
  setup(props, { slots }) {
    const { size, isIndeterminate } = props
    return () =>
      h(
        "svg",
        {
          viewBox: "0 0 100 100",
          style: {
            width: size,
            height: size,
            animation: isIndeterminate
              ? `${rotate} 2s linear infinite`
              : undefined,
          },
        },
        slots.default?.(),
      )
  },
})
