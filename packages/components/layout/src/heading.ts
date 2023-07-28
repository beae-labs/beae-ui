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

export interface HeadingProps
  extends HTMLBeaeProps<"h2">,
    ThemingProps<"Heading"> {}

export const Heading: ComponentWithProps<DeepPartial<HeadingProps>> =
  defineComponent({
    name: "Heading",
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
      const styles = useStyleConfig("Heading", themingProps)

      return () =>
        h(
          beae.h2,
          {
            as: props.as,
            __label: "heading",
            __css: styles.value,
            ...attrs,
          },
          slots,
        )
    },
  })
