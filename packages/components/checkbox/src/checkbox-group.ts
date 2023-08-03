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

import { type PropType, computed, defineComponent, renderSlot } from "vue"
import { type CheckboxGroupProps } from "./checkbox.types"
import { vueThemingProps } from "@beae-ui/prop-utils"
import { CheckboxGroupProvider } from "./checkbox-group.context"
import { useCheckboxGroup } from "./use-checkbox-group"

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
  emits: ["update:modelValue"],
  setup(props, { emit, slots }) {
    // Take variable don't need reactive
    const { colorScheme, size, variant } = props

    const checkboxBindingComputed = computed(() => ({
      context: computed(() => props),
      emit,
    }))
    const {} = useCheckboxGroup(checkboxBindingComputed)

    const checkboxGroupContext = computed(() => ({
      size,
      variant,
      colorScheme,
      modelValue: checkboxBindingComputed.value.context.value.modelValue,
      isDisabled: checkboxBindingComputed.value.context.value.isDisabled,
    }))

    CheckboxGroupProvider(checkboxGroupContext)

    return () => renderSlot(slots, "default")
  },
})

export interface UseControllableStateProps<T> {
  value?: T
  defaultValue?: T | (() => T)
  onChange?: (value: T) => void
  shouldUpdate?: (prev: T, next: T) => boolean
}
