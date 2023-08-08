/**
 * 📝 Notes for Contributors:
 *
 * - When creating an interactive component, we recommend consuming the
 * component hook created.
 *
 * For example, if you wanted to build an accordion component,
 * you'll first create a `useAccordion` hook and then create an `Accordion` component
 *
 * - Ensure this component is properly theme-able by following [this guide](https://ui.beae.com/docs/theming/component-style)
 *
 * - Ensure the component is composable and can adapt to multiple use-cases
 *
 * @see Guide https://ui.beae.com/guides/component-guide
 * @see Theming https://ui.beae.com/docs/theming/component-style
 */

import { defineComponent, computed, h } from "vue"
import {
  type HTMLBeaeProps,
  type SystemStyleObject,
  useStyleConfig,
  beae,
} from "@beae-ui/system"
import { Box } from "@beae-ui/layout"
import { getValidChildren } from "@beae-ui/utils"

const FALLBACK_ID = "beae-skip-nav"

export interface SkipNavLinkProps extends HTMLBeaeProps<"a"> {}

export const SkipNavLink = defineComponent({
  name: "SkipNavLink",
  props: {
    id: {
      type: String,
      default: FALLBACK_ID,
    },
  },
  setup(props, { slots, attrs }) {
    // @ts-ignore
    const styles = useStyleConfig("SkipLink", props)

    const skipLinkStyles = computed<SystemStyleObject>(() => {
      return {
        userSelect: "none",
        border: "0",
        borderRadius: "md",
        fontWeight: "semibold",
        height: "1px",
        width: "1px",
        margin: "-1px",
        padding: "0",
        outline: "0",
        overflow: "hidden",
        position: "absolute",
        clip: "rect(0 0 0 0)",
        ...styles.value,
        _focus: {
          clip: "auto",
          width: "auto",
          height: "auto",
          boxShadow: "outline",
          padding: "1rem",
          position: "fixed",
          top: "1.5rem",
          insetStart: "1.5rem",
        },
      }
    })

    return () => {
      return h(
        beae.a,
        {
          href: `#${props.id}`,
          __css: skipLinkStyles.value,
          ...attrs,
        },
        () => getValidChildren(slots),
      )
    }
  },
})

export interface SkipNavContentProps extends HTMLBeaeProps<"div"> {}

export const SkipNavContent = defineComponent({
  name: "SkipNavContent",
  props: {
    id: {
      type: String,
      default: FALLBACK_ID,
    },
  },
  setup(props, { attrs, slots }) {
    return () => {
      // @ts-ignore
      return h(
        Box,
        {
          tabIndex: "-1",
          id: props.id,
          "data-testid": FALLBACK_ID,
          ...attrs,
        },
        () => getValidChildren(slots),
      )
    }
  },
})
