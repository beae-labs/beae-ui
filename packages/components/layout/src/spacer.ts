import {
  beae,
  ComponentWithProps,
  DeepPartial,
  HTMLBeaeProps,
} from "@beae-ui/system"
import { defineComponent, h } from "vue"

export interface SpacerProps extends HTMLBeaeProps<"div"> {}

/**
 * A flexible flex spacer that expands along the major axis of its containing flex layout.
 * It renders a `div` by default, and takes up any available space.
 *
 * @see Docs https://beae-ui.com/docs/layout/flex#using-the-spacer
 */
export const LSpacer: ComponentWithProps<DeepPartial<SpacerProps>> =
  defineComponent({
    name: "LSpacer",
    setup(_, { slots }) {
      return () =>
        h(
          beae.div,
          {
            __label: "spacer",
            baseStyle: {
              flex: 1,
              justifySelf: "stretch",
              alignSelf: "stretch",
            },
          },
          slots,
        )
    },
  })
