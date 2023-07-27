import {
  beae,
  ComponentWithProps,
  DeepPartial,
  HTMLBeaeProps,
  StylesProvider,
  ThemingProps,
  useMultiStyleConfig,
  useStyles,
} from "@beae-ui/system"
import { defineComponent, h, PropType } from "vue"
import { vueThemingProps } from "@beae-ui/prop-utils"
import { useFormControlContext } from "./use-form-control"
import { Icon, IconProps } from "@beae-ui/icon"
import { SNAO } from "@beae-ui/utils"

export interface FormErrorMessageProps
  extends HTMLBeaeProps<"div">,
    ThemingProps<"FormErrorMessage"> {}

export const FormErrorMessage: ComponentWithProps<FormErrorMessageProps> =
  defineComponent({
    name: "FormErrorMessage",
    props: {
      ...vueThemingProps,
    },
    setup(props, { slots, attrs }) {
      const styles = useMultiStyleConfig("FormError", props)
      const field = useFormControlContext()

      StylesProvider(styles)

      const handleBeforeVNodeMounted = () => {
        field.value.hasFeedbackText.value = true
      }

      return () => {
        if (!field?.value?.isInvalid?.value) return null

        return h(
          beae("div", {
            __label: "form__error-message",
            onVnodeBeforeMount: { handleBeforeVNodeMounted },
            __css: {
              display: "flex",
              alignItems: "center",
              ...styles.value.text,
            },
            ...attrs,
          }),
          slots,
        )
      }
    },
  })

/**
 * Used as the visual indicator that a field is invalid or
 * a field has incorrect values.
 */

const errorIconProps = {
  as: SNAO as PropType<IconProps["as"]>,
  size: SNAO as PropType<IconProps["size"]>,
  name: String as PropType<IconProps["name"]>,
}

export const FormErrorIcon: ComponentWithProps<DeepPartial<IconProps>> =
  defineComponent({
    name: "FormErrorIcon",
    props: errorIconProps,
    setup(props, { attrs }) {
      const styles = useStyles()
      const field = useFormControlContext()

      return () => {
        if (!field?.value?.isInvalid?.value) return null

        return h(
          // @ts-ignore
          Icon,
          {
            ariaHidden: true,
            // @ts-ignore
            __css: styles.value.icon,
            class: "beae-form__error-icon",
            ...props,
            ...attrs,
            name: "__error_icon",
          },
        )
      }
    },
  })
