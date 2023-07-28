import {
  beae,
  DOMElements,
  DeepPartial,
  ComponentWithProps,
  HTMLBeaeProps,
} from "@beae-ui/system"
import { h, defineComponent, PropType } from "vue"

export interface LinkOverlayProps extends HTMLBeaeProps<"a"> {
  /**
   *  If `true`, the link will open in new tab
   */
  isExternal?: boolean
}

export const LLinkOverlay: ComponentWithProps<DeepPartial<LinkOverlayProps>> =
  defineComponent({
    name: "LLinkOverlay",
    props: {
      as: {
        type: [Object, String] as PropType<DOMElements>,
        default: "a",
      },
      isExternal: Boolean as PropType<LinkOverlayProps["isExternal"]>,
    },
    setup(props, { slots, attrs }) {
      return () =>
        h(
          beae.div,
          {
            as: props.as,
            __label: "linkbox__overlay",
            rel: props.isExternal ? "noopener noreferrer" : undefined,
            target: props.isExternal ? "_blank" : undefined,
            __css: {
              position: "static",
              "&::before": {
                content: "''",
                cursor: "inherit",
                display: "block",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 0,
                width: "100%",
                height: "100%",
              },
            },
            ...attrs,
          },
          slots,
        )
    },
  })

export interface LinkBoxProps extends HTMLBeaeProps<"div"> {}

/**
 * `LinkBox` is used to wrap content areas within a link while ensuring semantic html
 *
 * @see Docs https://vue.beae-ui.com/docs/link-overlay
 * @see Resources https://www.sarasoueidan.com/blog/nested-links
 */
export const LLinkBox: ComponentWithProps<DeepPartial<LinkBoxProps>> =
  defineComponent({
    name: "LLinkBox",
    props: {
      as: {
        type: [Object, String] as PropType<DOMElements>,
        default: "div",
      },
    },
    setup(props, { slots, attrs }) {
      return () =>
        h(
          beae.div,
          {
            as: props.as,
            __label: "linkbox",
            position: "relative",
            __css: {
              /* Elevates links and abbreviations */
              "a[href]:not(.beae-linkbox__overlay), abbr[title]": {
                position: "relative",
                zIndex: 1,
              },
            },
            ...attrs,
          },
          slots,
        )
    },
  })
