import { Icon } from "@beae-ui/icon"
import {
  beae,
  DOMElements,
  HTMLBeaeProps,
  SystemProps,
  ThemingProps,
  useMultiStyleConfig,
  useStyles,
  StylesProvider,
  ComponentWithProps,
  DeepPartial,
} from "@beae-ui/system"
import { h, defineComponent, PropType, computed } from "vue"
import { getValidChildren, SNAO, SAO } from "@beae-ui/utils"

interface ListOptions {
  /**
   * Short hand prop for `listStyleType`
   * @type SystemProps["listStyleType"]
   */
  styleType?: SystemProps["listStyleType"]
  /**
   * Short hand prop for `listStylePosition`
   * @type SystemProps["listStylePosition"]
   */
  stylePosition?: SystemProps["listStylePosition"]
  /**
   * The space between each list item
   * @type SystemProps["margin"]
   */
  spacing?: SystemProps["margin"]
}

export interface ListProps
  extends HTMLBeaeProps<"ul">,
    ThemingProps<"List">,
    ListOptions {}

/**
 * List is used to display list items, it renders a `<ul>` by default.
 *
 * @see Docs https://vue.beae-ui.com/docs/data-display/list
 */
export const LList: ComponentWithProps<DeepPartial<ListProps>> =
  defineComponent({
    name: "LList",
    props: {
      as: {
        type: [Object, String] as PropType<DOMElements>,
        default: "ul",
      },
      styleType: {
        type: SAO as PropType<ListProps["listStyleType"]>,
        default: "none",
      },
      stylePosition: SAO as PropType<ListProps["listStylePosition"]>,
      spacing: SNAO as PropType<ListProps["margin"]>,
    },
    setup(props, { slots, attrs }) {
      const styles = useMultiStyleConfig("List", props)
      StylesProvider(styles)
      const selector = "& > *:not(style) ~ *:not(style)"

      const spacingStyle = computed(() =>
        props.spacing ? { [selector]: { mt: props.spacing } } : {},
      )

      return () => {
        const validChildren = () => getValidChildren(slots)

        return h(
          beae.ul,
          {
            __label: "list",
            as: props.as,
            listStyleType: props.styleType,
            listStylePosition: props.stylePosition,
            role: "list",
            __css: {
              ...styles.value.container,
              ...spacingStyle.value,
            },
            ...attrs,
          },
          validChildren,
        )
      }
    },
  })

export const LOrderedList: ComponentWithProps<DeepPartial<ListProps>> =
  defineComponent({
    name: "LOrderedList",
    setup(props, { slots, attrs }) {
      return () =>
        h(
          beae(LList, {
            styleType: "decimal",
            marginStart: "1em",
            ...attrs,
          }),
          {},
          slots,
        )
    },
  })

export const LUnorderedList: ComponentWithProps<DeepPartial<ListProps>> =
  defineComponent({
    name: "UUnorderedList",
    setup(props, { slots, attrs }) {
      return () =>
        h(
          beae(LList, {
            styleType: "initial",
            marginStart: "1em",
            ...attrs,
          }),
          {},
          slots,
        )
    },
  })

export const LListItem: ComponentWithProps<DeepPartial<HTMLBeaeProps<"li">>> =
  defineComponent({
    name: "LListItem",
    setup(_, { slots, attrs }) {
      const styles = useStyles()
      return () =>
        h(
          beae.li,
          {
            __label: "list__item",
            // @ts-ignore
            __css: styles.value.item,
            ...attrs,
          },
          slots,
        )
    },
  })

export const LListIcon: ComponentWithProps<DeepPartial<HTMLBeaeProps<"svg">>> =
  defineComponent({
    name: "LListIcon",
    setup(_, { slots, attrs }) {
      const styles = useStyles()
      return () =>
        h(
          beae(Icon, {
            role: "presentation",
            // @ts-ignore
            __css: styles.value.icon,
            ...attrs,
          }),
          {},
          slots,
        )
    },
  })
