/**
 * 📝 Notes for Contributors:
 *
 * - When creating an interactive component, we recommend consuming the
 * component hook created.
 *
 * For example, if you wanted to build an accordion component,
 * you'll first create a `useAccordion` hook and then create an `Accordion` component
 *
 * - Ensure this component is properly theme able by following [this guide](https://ui.beae.com/docs/theming/component-style)
 *
 * - Ensure the component is composable and can adapt to multiple use-cases
 *
 * @see Guide https://ui.beae.com/guides/component-guide
 * @see Theming https://ui.beae.com/docs/theming/component-style
 */

import { type PropType, computed, defineComponent, h } from "vue"
import { type CheckboxGroupProps } from "./checkbox.types"
import { vueThemingProps } from "@beae-ui/prop-utils"
import { CheckboxGroupProvider } from "./checkbox.context"
import { useCheckboxGroup } from "./use-checkbox-group"
import { beae } from "@beae-ui/system"
import { getValidChildren } from "@beae-ui/utils"

const props = {
  modelValue: {
    type: Array as PropType<CheckboxGroupProps["modelValue"]>,
    default: () => [],
  },
  isDisabled: {
    type: Boolean as PropType<CheckboxGroupProps["isDisabled"]>,
    default: () => false,
  },
  ...vueThemingProps,
}

/**
 * Used for multiple checkboxes which are bound in one group,
 * and it indicates whether one or more options are selected.
 *
 * @see Docs https://beae-ui.com/checkbox
 */
export const CheckboxGroup = defineComponent({
  name: "CheckboxGroup",
  props,
  emits: ["change", "update:modelValue"],
  setup(props, { attrs, emit, slots }) {
    const { colorScheme, size, styleConfig, variant } = props

    const useCheckboxGroupOptionComputed = computed(() => ({
      context: props,
      emit,
    }))

    const { getRootProps, isDisabled, onChange, value } = useCheckboxGroup(
      useCheckboxGroupOptionComputed,
    )

    const checkboxGroupContext = computed(() => ({
      colorScheme,
      isDisabled,
      value,
      onChange,
      size,
      styleConfig,
      variant,
    }))

    CheckboxGroupProvider(checkboxGroupContext)

    return () =>
      h(
        beae.div,
        {
          __label: "checkbox__group",
          ...getRootProps(attrs),
        },
        () => getValidChildren(slots),
      )
  },
})
