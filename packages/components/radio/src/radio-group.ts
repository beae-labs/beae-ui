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

import {
  ComputedRef,
  PropType,
  computed,
  defineComponent,
  h,
  toRefs,
} from "vue"
import {
  ComponentWithProps,
  DeepPartial,
  HTMLBeaeProps,
  ThemingProps,
  beae,
} from "@beae-ui/system"
import { createContext, getValidChildren } from "@beae-ui/utils"
import {
  UseRadioGroupProps,
  UseRadioGroupReturn,
  useRadioGroup,
} from "./use-radio-group"
import { vueThemingProps } from "../../../utilities/prop-utils/src"

export type RadioGroupContext = ComputedRef<
  Pick<UseRadioGroupReturn, "value" | "name" | "isDisabled" | "isFocusable"> &
    Omit<ThemingProps<"Radio">, "orientation"> & {}
>

const [RadioGroupProvider, useRadioGroupContext] =
  createContext<RadioGroupContext>({
    name: "RadioGroupContext",
    strict: false,
  })

type Omitted = "value" | "defaultValue" | "defaultChecked"
export interface RadioGroupProps
  extends UseRadioGroupProps,
    Omit<HTMLBeaeProps<"div">, Omitted>,
    Omit<ThemingProps<"Radio">, "orientation"> {}

/**
 * Used for multiple radios which are bound in one group,
 * and it indicates which option is selected.
 *
 * @see Docs https://ui.beae.com/radio
 */
export const RadioGroup: ComponentWithProps<DeepPartial<RadioGroupProps>> =
  defineComponent({
    name: "RadioGroup",
    props: {
      isDisabled: Boolean as PropType<RadioGroupProps["isDisabled"]>,
      isFocusable: Boolean as PropType<RadioGroupProps["isFocusable"]>,
      name: String as PropType<RadioGroupProps["name"]>,
      value: String as PropType<RadioGroupProps["value"]>,
      ...vueThemingProps,
    },
    emits: ["change", "update:modelValue"],
    setup(props, { attrs, slots }) {
      const { value, getRootProps, name, htmlProps } = useRadioGroup(
        toRefs(props),
      )

      const radioGroupContext = computed(() => ({
        name,
        value,
        size: props.size,
        variant: props.variant,
        isDisabled: props.isDisabled,
        isFocusable: props.isFocusable,
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

export { useRadioGroupContext }
