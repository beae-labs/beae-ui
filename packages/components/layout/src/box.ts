import { computed, defineComponent, h, PropType } from "vue"
import {
  beae,
  DOMElements,
  SystemStyleObject,
  HTMLBeaeProps,
  DeepPartial,
  ComponentWithProps,
} from "@beae-ui/system"

export interface BoxProps extends HTMLBeaeProps<"div"> {}

/**
 * Box is the most abstract component on top of which other beae
 * components are built. It renders a `div` element by default.
 *
 * @see Docs https://beae-ui.beae.com/docs/layout/box
 */
export const Box: ComponentWithProps<DeepPartial<BoxProps>> = defineComponent({
  name: "Box",
  props: {
    as: {
      type: [String, Object] as PropType<DOMElements>,
      default: "div",
    },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        beae("div", {
          label: "box",
        }),
        {
          as: props.as,
          ...attrs,
        },
        () => slots?.default?.(),
      )
  },
})
/**
 * As a constraint, you can't pass size related props
 * Only `size` would be allowed
 */
type Omitted = "size" | "boxSize" | "width" | "height" | "w" | "h"

export interface SquareProps extends Omit<BoxProps, Omitted> {
  /**
   * The size (width and height) of the square
   */
  size?: BoxProps["width"]
  /**
   * If `true`, the content will be centered in the square
   */
  centerContent?: boolean
}

/**
 * LSquare is the `Box` component implemented as a square
 *
 * @see Docs https://beae-ui.beae.com/docs/layout/box
 */
export const LSquare: ComponentWithProps<DeepPartial<SquareProps>> =
  defineComponent({
    name: "LSquare",
    props: {
      size: [Object, String, Number] as PropType<SquareProps["size"]>,
      centerContent: {
        type: [Boolean] as PropType<SquareProps["centerContent"]>,
        default: true,
      },
    },
    setup(props, { slots, attrs }) {
      const styles = computed<SystemStyleObject>(() =>
        props.centerContent
          ? { display: "flex", alignItems: "center", justifyContent: "center" }
          : {},
      )

      return () =>
        h(
          beae(Box, {
            boxSize: props.size,
            label: "square",
          }),
          {
            __css: {
              ...styles.value,
              flexShrink: 0,
              flexGrow: 0,
            },
            ...attrs,
          },
          slots,
        )
    },
  })

/**
 * LCircle is the `Box` component implemented as a circle
 *
 * @see Docs https://beae-ui.beae.com/docs/layout/box
 */
export const LCircle: ComponentWithProps<DeepPartial<SquareProps>> =
  defineComponent({
    name: "LCircle",
    setup(_, { slots, attrs }) {
      return () =>
        h(
          beae(LSquare, {
            label: "circle",
            borderRadius: "9999px",
          }),
          { ...attrs },
          slots,
        )
    },
  })
