import { h, defineComponent, PropType, computed } from "vue"
import {
  beae,
  DOMElements,
  HTMLBeaeProps,
  ThemingProps,
  useStyleConfig,
  ComponentWithProps,
  DeepPartial,
} from "@beae-ui/system"
import { filterUndefined } from "@beae-ui/utils"
import { vueThemingProps } from "@beae-ui/prop-utils"

export interface BadgeProps
  extends HTMLBeaeProps<"span">,
    Partial<ThemingProps<"Badge">> {}

/**
 * Vue component used to display notifications, messages, or
 * statuses in different shapes and sizes.
 *
 * @see Docs https://vue.beae-ui.com/docs/data-display/badge
 */
export const LBadge: ComponentWithProps<DeepPartial<BadgeProps>> =
  defineComponent({
    name: "LBadge",
    props: {
      as: {
        type: [Object, String] as PropType<DOMElements>,
        default: "div",
      },
      ...vueThemingProps,
    },
    setup(props, { slots, attrs }) {
      const themingProps = computed<ThemingProps>(() =>
        filterUndefined({
          colorScheme: props.colorScheme,
          variant: props.variant,
          size: props.size,
          styleConfig: props.styleConfig,
        }),
      )
      const styles = useStyleConfig("Badge", themingProps)
      return () =>
        h(
          beae.div,
          {
            as: props.as,
            __label: "badge",
            __css: {
              display: "inline-block",
              whiteSpace: "nowrap",
              verticalAlign: "middle",
              ...styles.value,
            },
            ...attrs,
          },
          slots,
        )
    },
  })
