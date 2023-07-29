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

import {
  defineComponent,
  PropType,
  computed,
  cloneVNode,
  h,
  VNode,
  DefineComponent,
} from "vue"
import {
  beae,
  HTMLBeaeProps,
  SystemProps,
  ThemingProps,
  StylesProvider,
  useMultiStyleConfig,
  useStyles,
  SystemStyleObject,
  BeaeProps,
} from "@beae-ui/system"
import { filterUndefined } from "@beae-ui/utils"
import { getValidChildren, isObjectComponent, SNA, SNAO } from "@beae-ui/utils"
import { vueThemingProps } from "@beae-ui/prop-utils"
import { DOMElements } from "@beae-ui/system"

/**
 * Breadcrumb (root)
 */

export interface BreadcrumbOptions {
  /**
   * The visual separator between each breadcrumb item
   * @type string | ConcreteComponent | Component
   */
  separator?: string | object
  /**
   * The left and right margin applied to the separator
   * @type SystemProps["mx"]
   */
  spacing?: SystemProps["mx"]
}

export interface BreadcrumbProps
  extends BeaeProps,
    BreadcrumbOptions,
    ThemingProps<"Breadcrumb"> {}

// TODO: fix a nhé @ToanTran
export const Breadcrumb: DefineComponent<BreadcrumbProps> = defineComponent({
  props: {
    separator: {
      type: SNAO as PropType<BreadcrumbOptions["separator"]>,
      default: "/",
    },
    spacing: {
      type: SNA as PropType<BreadcrumbOptions["spacing"]>,
      default: "0.5rem",
    },
    as: {
      type: [String, Object] as PropType<DOMElements | object | string>,
      default: "nav",
    },
    ...vueThemingProps,
  },
  setup(props, { attrs, slots }) {
    const themingProps = computed<ThemingProps>(() =>
      filterUndefined({
        colorScheme: props.colorScheme,
        variant: props.variant,
        size: props.size,
        styleConfig: props.styleConfig,
      }),
    )

    const styles = useMultiStyleConfig("Breadcrumb", themingProps)
    StylesProvider(styles)

    const separator = computed(() => {
      if (slots.separator) {
        return slots?.separator?.()
      } else {
        return typeof props.separator === "string"
          ? props.separator
          : isObjectComponent(props.separator!)
          ? // TODO:
            // Add support for
            // object components. ATM,
            // This computed property will only
            // work for functional components provided as
            // separators
            h(() => props.separator!)
          : h(props.separator!)
      }
    })

    return () => {
      const validChildren = getValidChildren(slots)
      const count = validChildren.length

      const children = validChildren.map(
        (vnode: VNode<unknown, unknown, BreadcrumbOptions>, index: number) =>
          cloneVNode(vnode, {
            separator: separator.value,
            spacing: props.spacing,
            isLastChild: count === index + 1,
          }),
      )

      return h(
        beae.nav,
        {
          as: props.as,
          __label: "breadcrumb",
          ariaLabel: "breadcrumb",
          __css: styles.value.container,
          ...attrs,
        },
        () => h(beae.ol, { __label: "breadcrumb__list" }, () => children),
      )
    }
  },
})

// @ts-ignore "name" property is typically read-only for functional components

/**
 * BreadcrumbSeparator
 */

export interface BreadcrumbSeparatorProps extends HTMLBeaeProps<"div"> {
  /**
   * @type SystemProps["mx"]
   */
  spacing?: SystemProps["mx"]
}

/**
 * The `BreadcrumbSeparator` component is the separator for
 * each breadcrumb item.
 */
export const BreadcrumbSeparator = defineComponent({
  props: {
    spacing: Breadcrumb.props.spacing,
  },
  setup(props, { attrs, slots }) {
    const styles = useStyles()
    const separatorStyles = computed<SystemStyleObject>(() => ({
      display: "flex",
      mx: props.spacing,
      // @ts-ignore
      ...styles.value.separator,
    }))

    return () =>
      h(
        beae.span,
        {
          role: "presentation",
          __label: "breadcrumb__separator",
          ...attrs,
          __css: separatorStyles.value,
        },
        slots,
      )
  },
})

// @ts-ignore "name" property is typically read-only for functional components
BreadcrumbSeparator.name = "BreadcrumbSeparator"

/**
 * BreadcrumbItem
 */

interface BreadcrumbItemOptions extends BreadcrumbOptions {
  isCurrentPage?: boolean
  isLastChild?: boolean
}

export interface BreadcrumbItemProps extends BreadcrumbItemOptions, BeaeProps {}

export const BreadcrumbItem: DefineComponent<BreadcrumbItemProps> =
  defineComponent((props: BreadcrumbItemProps, { attrs, slots }) => {
    const styles = useStyles()
    const itemStyles = computed<SystemStyleObject>(() => ({
      display: "inline-flex",
      alignItems: "center",
      // @ts-ignore
      ...styles.value.item,
    }))

    return () => {
      const validChildren = getValidChildren(slots)
      const children = validChildren.map(
        (vnode: VNode<unknown, unknown, BreadcrumbItemOptions>) => {
          // @ts-expect-error The "name" property is not typed on `VNodeTypes` but we need to access it during runtime
          if (vnode.type.name === "BreadcrumbLink") {
            return cloneVNode(vnode, {
              isCurrentPage: props.isCurrentPage,
            })
          }

          // @ts-expect-error The "name" property is not typed on `VNodeTypes` but we need to access it during runtime
          if (vnode.type.name === "BreadcrumbSeparator") {
            return cloneVNode(vnode, {
              spacing: props.spacing,
              children: vnode.children || { default: () => props.separator },
            })
          }

          return vnode
        },
      )

      return h(
        beae.li,
        { __label: "breadcrumb__list-item", __css: itemStyles.value },
        () => [
          //Todo : Failed setting prop "children" on <span>: value [object Object] is invalid.
          children,
          !props.isLastChild &&
            h(
              BreadcrumbSeparator,
              { spacing: props.spacing },
              () => props.separator,
            ),
        ],
      )
    }
  })

// @ts-ignore "name" property is typically read-only for functional components
BreadcrumbItem.name = "BreadcrumbItem"
BreadcrumbItem.props = {
  ...Breadcrumb.props,
  isLastChild: Boolean as PropType<boolean>,
  isCurrentPage: Boolean as PropType<boolean>,
}
