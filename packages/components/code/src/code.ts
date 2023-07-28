import { defineComponent, h, PropType, computed } from "vue"
import {
  beae,
  useStyleConfig,
  ThemingProps,
  DeepPartial,
  ComponentWithProps,
  HTMLBeaeProps,
} from "@beae-ui/system"
import { vueThemingProps } from "@beae-ui/prop-utils"
import { filterUndefined } from "@beae-ui/utils"

export interface CodeProps extends HTMLBeaeProps<"div"> {}

export const Code: ComponentWithProps<DeepPartial<CodeProps>> = defineComponent(
  {
    props: {
      as: {
        type: [Object, String] as PropType<CodeProps["as"]>,
        default: "code",
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

      const styles = useStyleConfig("Code", themingProps)
      return () => {
        return h(
          beae(props?.as ?? "Code", {
            __css: {
              display: "inline-block",
              verticalAlign: "middle",
              fontSize: "sm",
              px: "0.2em",
              fontFamily: "mono",
              rounded: "sm",
              ...styles.value,
            },
          }),
          attrs,
          slots,
        )
      }
    },
  },
)

export default Code
