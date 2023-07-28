import { filterUndefined, SNAO } from "@beae-ui/utils"
import { vueThemingProps } from "@beae-ui/prop-utils"
import {
  beae,
  HTMLBeaeProps,
  ThemingProps,
  SystemProps,
  useStyleConfig,
  DOMElements,
  ComponentWithProps,
  DeepPartial,
} from "@beae-ui/system"
import { computed, defineComponent, h, PropType } from "vue"

export interface TextProps extends HTMLBeaeProps<"p">, ThemingProps<"Text"> {
  /**
   * The CSS `text-align` property
   * @type SystemProps["textAlign"]
   */
  align?: SystemProps["textAlign"]
  /**
   * The CSS `text-decoration` property
   * @type SystemProps["textDecoration"]
   */
  decoration?: SystemProps["textDecoration"]
  /**
   * The CSS `text-transform` property
   * @type SystemProps["textTransform"]
   */
  casing?: SystemProps["textTransform"]
}

/**
 * Used to render texts or paragraphs.
 *
 * @see Docs https://vue.beae-ui.com/docs/typography/text
 */
export const Text: ComponentWithProps<DeepPartial<TextProps>> = defineComponent(
  {
    name: "Text",
    props: {
      as: {
        type: [Object, String] as PropType<DOMElements>,
        default: "p",
      },
      align: SNAO as PropType<TextProps["textAlign"]>,
      decoration: SNAO as PropType<TextProps["textDecoration"]>,
      casing: SNAO as PropType<TextProps["textTransform"]>,
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

      // TODO: add text into type of useStyleConfig
      // @ts-ignore
      const styles = useStyleConfig("Text", themingProps)

      const aliasedProps = computed(() =>
        filterUndefined({
          textAlign: props.align,
          textDecoration: props.decoration,
          textTransform: props.casing,
        }),
      )

      return () =>
        h(
          beae.p,
          {
            __label: "text",
            ...aliasedProps.value,
            __css: styles.value,
            ...attrs,
          },
          slots,
        )
    },
  },
)
