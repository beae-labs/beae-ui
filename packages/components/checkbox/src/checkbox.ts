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

import { defineComponent, h } from "vue"
import { HTMLBeaeProps, ComponentWithProps, DeepPartial } from "@beae-ui/system"

export interface CheckboxProps extends HTMLBeaeProps<"div"> {}

export const Checkbox: ComponentWithProps<DeepPartial<CheckboxProps>> =
  defineComponent({
    name: "Checkbox",
    setup() {
      return () => h("div")
    },
  })
