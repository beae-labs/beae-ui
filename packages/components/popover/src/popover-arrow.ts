import { type HTMLBeaeProps, beae } from "@beae-ui/system"
import { type SystemProps } from "@beae-ui/styled-system"
import { computed, defineComponent, h } from "vue"
import { useStyles } from "./popover.context"

export interface PopoverArrowProps extends HTMLBeaeProps<"div"> {
  /**
   * The color of the arrow's shadow
   */
  shadowColor?: SystemProps["color"]
}

export const PopoverArrow = defineComponent({
  name: "PopoverArrow",
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const styles = useStyles()

    const arrowBg = computed(
      () => attrs.bg ?? attrs.bgColor ?? attrs.backgroundColor,
    )
    const arrowShadow = computed(() => attrs.shadow ?? attrs.boxShadow)

    return () =>
      h(
        beae.div,
        {
          __label: "popover__arrow-positioner",
          __css: {
            "--arrow-size": "10px",
            "--popper-arrow-default-shadow":
              "-1px -1px 1px 0 var(--popper-arrow-shadow-color)",
            "--arrow-shadow-color": `${
              arrowShadow.value
                ? `shadows.${arrowShadow.value} ${arrowShadow.value}`
                : ""
            } var(--popper-arrow-shadow, var(--popper-arrow-default-shadow))`,
          },
        },
        h(
          beae.div,
          {
            __label: "popover__arrow",
            __css: {
              ...styles.value.arrow,
              "--arrow-size": "10px",
              "--arrow-background": arrowBg.value
                ? `colors.${arrowBg.value}, var(--popper-arrow-bg), ${arrowBg.value}`
                : "var(--popper-arrow-bg)",
              boxShadow:
                "var(--popper-arrow-shadow, var(--popper-arrow-default-shadow))",
            },
            ...attrs,
          },
          slots.default?.(),
        ),
      )
  },
})
