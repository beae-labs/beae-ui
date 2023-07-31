import {
  beae,
  DOMElements,
  ThemingProps,
  useStyleConfig,
  HTMLBeaeProps,
  ComponentWithProps,
  DeepPartial,
} from "@beae-ui/system"
import { computed, defineComponent, h, PropType } from "vue"
import { filterUndefined } from "@beae-ui/utils"
import { vueThemingProps } from "@beae-ui/prop-utils"

export interface KbdProps extends HTMLBeaeProps<"kbd">, ThemingProps<"Kbd"> {}

/**
 * Semantic component to render a keyboard shortcut
 * within an application.
 *
 * @example
 *
 * ```js
 * <CKbd>⌘ + T</CKbd>
 * ```
 *
 * @see Docs https://vue.beae-ui.com/docs/data-display/kbd
 */
export const Kbd: ComponentWithProps<DeepPartial<KbdProps>> = defineComponent({
  name: "Kbd",
  props: {
    as: {
      type: [String, Object] as PropType<DOMElements>,
      default: "h2",
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
    const styles = useStyleConfig("Kbd", themingProps)

    return () =>
      h(
        beae.kbd,
        {
          __label: "kbd",
          __css: { fontFamily: "mono", ...styles.value },
          ...attrs,
        },
        slots,
      )
  },
})