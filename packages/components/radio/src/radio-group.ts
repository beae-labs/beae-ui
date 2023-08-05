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

import { type PropType, computed, defineComponent, h, toRefs, watch } from "vue"
import {
  type ComponentWithProps,
  type DeepPartial,
  beae,
} from "@beae-ui/system"
import { getValidChildren } from "@beae-ui/utils"
import { useRadioGroup } from "./use-radio-group"
import { vueThemingProps } from "@beae-ui/prop-utils"
import { type RadioGroupProps } from "./radio.types"
import { RadioGroupProvider } from "./radio.context"

const props = {
  defaultValue: String as PropType<RadioGroupProps["defaultValue"]>,
  modelValue: String as PropType<RadioGroupProps["modelValue"]>,
  value: String as PropType<RadioGroupProps["value"]>,
  isDisabled: Boolean as PropType<RadioGroupProps["isDisabled"]>,
  isFocusable: Boolean as PropType<RadioGroupProps["isFocusable"]>,
  name: String as PropType<RadioGroupProps["name"]>,
  ...vueThemingProps,
}

/**
 * Used for multiple radios which are bound in one group,
 * and it indicates which option is selected.
 *
 * @see Docs https://ui.beae.com/radio
 */
export const RadioGroup: ComponentWithProps<DeepPartial<RadioGroupProps>> =
  defineComponent({
    name: "RadioGroup",
    props,
    emits: ["change", "update:modelValue"],
    setup(props, { attrs, emit, slots }) {
      const useRadioGroupOptionComputed = computed(() => ({
        context: props,
        emit,
      }))
      const {
        isDisabled,
        isFocusable,
        getRootProps,
        onChange,
        name,
        value,
        htmlProps,
      } = useRadioGroup(useRadioGroupOptionComputed)

      const radioGroupContext = computed(() => ({
        name,
        value,
        onChange,
        size: props.size,
        variant: props.variant,
        isDisabled,
        isFocusable,
        colorScheme: props.colorScheme,
      }))

      RadioGroupProvider(radioGroupContext)

      return () =>
        h(
          beae.div,
          {
            __label: "radio__group",
            role: "radiogroup",
            ...getRootProps(htmlProps as any),
            ...attrs,
          },
          () => getValidChildren(slots),
        )
    },
  })
