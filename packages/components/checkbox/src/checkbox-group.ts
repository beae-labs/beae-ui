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

import { ThemingProps } from "@beae-ui/system"
import { ComputedRef } from "vue"

export interface CheckboxGroupProps
  extends UseCheckboxGroupProps,
    Omit<ThemingProps<"Checkbox">, "orientation"> {}

export type CheckboxGroupContext = ComputedRef<
  ThemingProps & {
    isDisabled?: boolean
    value: (string | number)[]
    handleChange(value: number | string, isChecked: boolean): void
  }
>

const [CheckboxGroupProvider, useCheckboxGroupContext] =
  createContext<CheckboxGroupContext>({
    strict: false,
    name: "CheckboxGroupContext",
  })
