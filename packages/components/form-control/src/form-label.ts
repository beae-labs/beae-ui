import { defineComponent, computed, h } from "vue"
import {
  beae,
  ComponentWithProps,
  HTMLBeaeProps,
  ThemingProps,
  useStyleConfig,
  useStyles,
} from "@beae-ui/system"
import { vueThemingProps } from "@beae-ui/prop-utils"
import { useFormControlContext } from "./use-form-control"

export interface FormLabelProps
  extends HTMLBeaeProps<"label">,
    ThemingProps<"FormLabel"> {}

export const FormLabel = defineComponent({
  name: "FormLabel",
  props: vueThemingProps,
  setup(props, { attrs, slots }) {
    const styles = useStyleConfig("FormLabel", props)
    const field = useFormControlContext()
    const requiredIndicator = computed(() => {
      if (slots.indicator) {
        return slots.indicator?.()
      } else {
        return h(LRequiredIndicator)
      }
    })

    return () =>
      h(
        beae.label,
        {
          __label: "form__label",
          __css: {
            display: "block",
            textAlign: "start",
            ...styles.value,
          },
          ...field?.value?.labelProps.value,
          ...attrs,
        },
        () => [
          slots?.default?.(),
          field?.value?.isRequired?.value ? requiredIndicator.value : null,
        ],
      )
  },
})

export interface LRequiredIndicatorProps extends HTMLBeaeProps<"span"> {}

/**
 * Used to show a "required" text or an asterisks (*) to indicate that
 * a field is required.
 */
export const LRequiredIndicator: ComponentWithProps<LRequiredIndicatorProps> =
  defineComponent({
    name: "LRequiredIndicator",
    setup(_, { attrs }) {
      const field = useFormControlContext()
      const styles = useStyles()

      if (!field?.value?.isRequired?.value) return null

      return () =>
        h(
          beae.span,
          {
            ...field?.value?.requiredIndicatorProps.value,
            // __css : styles.value?.requiredIndicator,
            __label: "form__required-indicator",
            ...attrs,
          },
          h("*"),
        )
    },
  })
