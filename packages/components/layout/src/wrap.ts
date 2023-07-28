import { Dict, mapResponsive } from "@beae-ui/utils"
import {
  beae,
  HTMLBeaeProps,
  SystemProps,
  DOMElements,
  tokenToCSSVar,
  ComponentWithProps,
} from "@beae-ui/system"
import { getValidChildren, SNAO } from "@beae-ui/utils"
import { computed, defineComponent, h, PropType } from "vue"

export interface WrapProps extends HTMLBeaeProps<"div"> {
  /**
   * The space between the each child (even if it wraps)
   * @type SystemProps["margin"]
   */
  spacing?: SystemProps["margin"]
  /**
   * The `justify-content` value (for cross-axis alignment)
   * @type SystemProps["justifyContent"]
   */
  justify?: SystemProps["justifyContent"]
  /**
   * The `align-items` value (for main axis alignment)
   * @type SystemProps["alignItems"]
   */
  align?: SystemProps["alignItems"]
  /**
   * The `flex-direction` value
   * @type SystemProps["flexDirection"]
   */
  direction?: SystemProps["flexDirection"]
  /**
   * If `true`, the children will be wrapped in a `WrapItem`
   */
  shouldWrapChildren?: boolean
}

export const LWrapProps = {
  spacing: SNAO as PropType<WrapProps["spacing"]>,
  justify: SNAO as PropType<WrapProps["justify"]>,
  align: SNAO as PropType<WrapProps["align"]>,
  direction: SNAO as PropType<WrapProps["direction"]>,
  shouldWrapChildren: SNAO as PropType<WrapProps["shouldWrapChildren"]>,
}

/**
 * Used to render texts or paragraphs.
 *
 * @see Docs https://vue.beae-ui.com/docs/typography/text
 */
export const LWrap: ComponentWithProps<WrapProps> = defineComponent({
  props: {
    as: {
      type: [Object, String] as PropType<DOMElements>,
      default: "div",
    },
    ...LWrapProps,
  },
  setup(props, { slots, attrs }) {
    const styles = computed(() => ({
      "--beae-wrap-spacing": (theme: Dict) =>
        mapResponsive(props.spacing, (value) =>
          tokenToCSSVar("space", value)(theme),
        ),
      "--wrap-spacing": "calc(var(--beae-wrap-spacing) / 2)",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: props.justify,
      alignItems: props.align,
      flexDirection: props.direction,
      listStyleType: "none",
      padding: "0",
      margin: "calc(var(--wrap-spacing) * -1)",
      "& > *:not(style)": {
        margin: "var(--wrap-spacing)",
      },
    }))

    const childrenToRender = props.shouldWrapChildren
      ? getValidChildren(slots).map((child, index) =>
          h(LWrapItem, { key: index }, child),
        )
      : slots

    return () => {
      return h(
        beae(props.as, {
          label: "wrap",
          ...attrs,
        }),
        {},
        () =>
          h(
            beae("ul", { label: "wrap__list", __css: styles.value }),
            {},
            childrenToRender,
          ),
      )
    }
  },
})

export interface WrapItemProps extends HTMLBeaeProps<"li"> {}

export const LWrapItem = defineComponent({
  setup(_, { attrs, slots }) {
    return () => {
      return h(
        beae("li", {
          label: "wrap__listItem",
          __css: {
            display: "flex",
            alignItems: "flex-start",
          },
          ...attrs,
        }),
        {},
        slots,
      )
    }
  },
})
