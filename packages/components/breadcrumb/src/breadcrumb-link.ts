import { type PropType, h, defineComponent } from "vue"
import { type BeaeProps, type DOMElements, useStyles } from "@beae-ui/system"
import { Link, LinkProps } from "@beae-ui/layout"

/**
 * BreadcrumbLink
 */

export interface BreadcrumbLinkProps extends BeaeProps {
  isCurrentPage?: boolean
  href?: string
}

/**
 * BreadcrumbLink link.
 *
 * It renders a `span` when it matches the current link. Otherwise,
 * it renders an anchor tag.
 */
export const BreadcrumbLink = defineComponent({
  name: "BreadcrumbLink",
  props: {
    as: {
      type: [Object, String] as PropType<DOMElements>,
      default: "a",
    },
    isExternal: Boolean as PropType<LinkProps["isExternal"]>,
    href: String as PropType<string>,
    isCurrentPage: Boolean as PropType<boolean>,
  },
  setup(props, { attrs, slots }) {
    const styles = useStyles()

    return () =>
      h(
        Link,
        {
          ariaCurrent: props.isCurrentPage ? "page" : null,
          __label: "breadcrumb__link",
          as: props.as,
          to: props.href,
          // TODO: link type check ts lint
          // @ts-ignore
          __css: styles.value.link,
          ...attrs,
        },
        slots,
      )
  },
})
