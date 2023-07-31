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

import { PropType, computed, defineComponent, toRefs, renderSlot } from "vue"
import { createContext } from "@beae-ui/utils"
import { vueThemingProps } from "../../../utilities/prop-utils/src"
import {
  UseCheckboxGroupProps,
  UseCheckboxGroupReturn,
  useCheckboxGroup,
} from "./use-checkbox-group"
import { ThemingProps } from "@beae-ui/system"

export interface CheckboxGroupProps
  extends UseCheckboxGroupProps,
    Omit<ThemingProps<"Checkbox">, "orientation"> {
  children?: React.ReactNode
}

export interface CheckboxGroupContext
  extends Pick<UseCheckboxGroupReturn, "onChange" | "value" | "isDisabled">,
    Omit<ThemingProps<"Checkbox">, "orientation"> {}

export const [CheckboxGroupProvider, useCheckboxGroupContext] =
  createContext<CheckboxGroupContext>({
    name: "CheckboxGroupContext",
    strict: false,
  })

/**
 * Used for multiple checkboxes which are bound in one group,
 * and it indicates whether one or more options are selected.
 *
 * @see Docs https://beae-ui.com/checkbox
 */
export const CheckboxGroup = defineComponent({
  name: "CheckboxGroup",
  props: {
    defaultValue: Array as PropType<CheckboxGroupProps["defaultValue"]>,
    value: Array as PropType<CheckboxGroupProps["value"]>,
    onChange: Function as PropType<CheckboxGroupProps["onChange"]>,
    isDisabled: Boolean as PropType<CheckboxGroupProps["isDisabled"]>,
    isNative: Boolean as PropType<CheckboxGroupProps["isNative"]>,
    ...vueThemingProps,
  },
  emits: ["change", "update:modelValue"],
  setup(props, { emit, slots }) {
    const { isDisabled, size, variant, colorScheme } = props
    const { value, onChange } = useCheckboxGroup(toRefs(props))

    const checkboxGroupContext = computed(() => ({
      onChange,
      value,
      isDisabled,
      size,
      variant,
      colorScheme,
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
