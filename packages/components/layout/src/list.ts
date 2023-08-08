import { Icon } from "@beae-ui/icon"
import {
  type DOMElements,
  type HTMLBeaeProps,
  type ThemingProps,
  StylesProvider,
  useMultiStyleConfig,
  useStyles,
  beae,
} from "@beae-ui/system"
import { type SystemProps } from "@beae-ui/styled-system"
import { type PropType, h, defineComponent, computed } from "vue"
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
export const List: any = () =>
  defineComponent({
    name: "List",
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

export const OrderedList = defineComponent({
  name: "OrderedList",
  setup(props, { slots, attrs }) {
    return () =>
      h(
        beae(List, {
          // @ts-ignore
          styleType: "decimal",
          marginStart: "1em",
          ...attrs,
        }),
        {},
        slots,
      )
  },
})

export const UnorderedList = defineComponent({
  name: "UnorderedList",
  setup(props, { slots, attrs }) {
    return () =>
      h(
        beae(List, {
          // @ts-ignore
          styleType: "initial",
          marginStart: "1em",
          ...attrs,
        }),
        {},
        slots,
      )
  },
})

export const ListItem = defineComponent({
  name: "ListItem",
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

export const ListIcon = defineComponent({
  name: "ListIcon",
  setup(_, { slots, attrs }) {
    const styles = useStyles()
    return () =>
      h(
        beae(Icon, {
          // @ts-ignore
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
