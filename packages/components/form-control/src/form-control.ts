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

import { type PropType, h, defineComponent, computed, toRefs } from "vue"
import {
  type DOMElements,
  type HTMLBeaeProps,
  StylesProvider,
  useMultiStyleConfig,
  useStyles,
  beae,
} from "@beae-ui/system"

import {
  FormControlProps,
  FormControlProviderContext,
  useFormControlProvider,
  FormControlProvider,
  useFormControlContext,
} from "./use-form-control"

/**
 * `FormControl` provides context such as
 * `isInvalid`, `isDisabled`, and `isRequired` to form elements.
 *
 * This is commonly used in form elements such as `input`,
 * `select`, `textarea`, etc.
 */

export const formControlProps = {
  isRequired: Boolean as PropType<FormControlProps["isRequired"]>,
  isDisabled: Boolean as PropType<FormControlProps["isDisabled"]>,
  isInvalid: Boolean as PropType<FormControlProps["isInvalid"]>,
  isReadOnly: Boolean as PropType<FormControlProps["isReadOnly"]>,
  label: String as PropType<FormControlProps["label"]>,
  id: String as PropType<FormControlProps["id"]>,
}

export const FormControl = defineComponent({
  props: {
    as: {
      type: [Object, String] as PropType<DOMElements>,
      default: "div",
    },
    ...formControlProps,
  },
  setup(_props, { slots, attrs }) {
    const { as, ...props } = toRefs(_props)
    const ownProps = computed(() => props)
    const styles = useMultiStyleConfig("Form", props)
    const { rootProps, ..._context } = useFormControlProvider(ownProps.value)

    const context: FormControlProviderContext = computed(() => _context)

    FormControlProvider(context)
    StylesProvider(styles)

    return () =>
      h(
        beae.div,
        {
          as: as.value,
          ...rootProps.value,
          __css: styles.value.container,
          __label: "form",
          ...attrs,
        },
        slots,
      )
  },
})

export interface HelpTextProps extends HTMLBeaeProps<"div"> {}
/**
 * FormHelperText
 *
 * Assistive component that conveys additional guidance
 * about the field, such as how it will be used and what
 * types in values should be provided.
 *
 * TODO: Handle Type Props pass into FormHelperText
 */

export const FormHelperText = defineComponent((props, { attrs, slots }) => {
  const field = useFormControlContext()
  const styles = useStyles()
  const handleVNodeMounted = () => {
    field.value.hasHelpText.value = true
  }

  return () =>
    h(
      beae.div,
      {
        __label: "form__helper-text",
        onVnodeBeforeMount: handleVNodeMounted,
        ...field.value.helperTextProps.value,
        // @ts-ignore
        __css: styles.value.helperText,
      },
      slots,
    )
})
