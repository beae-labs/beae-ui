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
  type PropType,
  computed,
  cloneVNode,
  defineComponent,
  h,
  mergeProps,
  getCurrentInstance,
} from "vue"
import { SNAO, vueThemingProps } from "@beae-ui/prop-utils"
import { useMultiStyleConfig, beae } from "@beae-ui/system"
import { type CheckboxProps } from "./checkbox.types"
import { useCheckbox } from "./use-checkbox"
import { getValidChildren } from "@beae-ui/utils"
import { CheckboxIcon } from "./checkbox-icon"

const props = {
  modelValue: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  value: [String, Number] as PropType<CheckboxProps["value"]>,
  isChecked: Boolean as PropType<CheckboxProps["isChecked"]>,
  isIndeterminate: Boolean as PropType<CheckboxProps["isIndeterminate"]>,
  isFocusable: Boolean as PropType<CheckboxProps["isFocusable"]>,
  isRequired: Boolean as PropType<CheckboxProps["isRequired"]>,
  isInvalid: Boolean as PropType<CheckboxProps["isInvalid"]>,
  isDisabled: Boolean as PropType<CheckboxProps["isDisabled"]>,
  isReadonly: Boolean as PropType<CheckboxProps["isReadOnly"]>,
  defaultChecked: Boolean as PropType<boolean>,
  name: String as PropType<CheckboxProps["name"]>,
  "aria-label": String as PropType<CheckboxProps["aria-label"]>,
  "aria-labelledby": String as PropType<CheckboxProps["aria-labelledby"]>,
  "aria-invalid": Boolean as PropType<CheckboxProps["aria-invalid"]>,
  "aria-describedby": String as PropType<CheckboxProps["aria-describedby"]>,
  spacing: {
    type: SNAO as PropType<CheckboxProps["spacing"]>,
    default: "0.5rem",
  },
  iconColor: String as PropType<CheckboxProps["iconColor"]>,
  iconSize: [String, Number] as PropType<CheckboxProps["iconSize"]>,
  inputProps: Object as PropType<CheckboxProps["inputProps"]>,
  ...vueThemingProps,
}

/**
 * Checkbox
 *
 * React component used in forms when a user needs to select
 * multiple values from several options.
 *
 * @see Docs https://ui.beae.com/checkbox
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 */
export const Checkbox = defineComponent({
  name: "Checkbox",
  props,
  emits: [
    "change",
    "mouseDown",
    "mouseUp",
    "mouseEnter",
    "mouseLeave",
    "update:modelValue",
  ],
  setup(props, { attrs, emit, slots }) {
    // create binding object to pass to hooks include data & event/emit
    const checkboxBindingComputed = computed(() => ({
      context: props,
      emit,
    }))

    // merge props with group & attributes
    const mergedPropsComputed = computed(() => mergeProps(props, attrs))

    const {
      getCheckboxProps,
      getLabelProps,
      getInputProps,
      getRootProps,
      isChecked,
    } = useCheckbox(checkboxBindingComputed)

    // define styles
    const styles = useMultiStyleConfig("Checkbox", mergedPropsComputed)
    const rootStyles = {
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      verticalAlign: "top",
      position: "relative",
    }
    const controlStyles = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      verticalAlign: "top",
      userSelect: "none",
      flexShrink: 0,
    }
    const iconStyles = computed(() => ({
      fontSize: props.iconSize,
      color: props.iconColor,
    }))

    // render some component before make return () => h()
    const clonedIcon = computed(() =>
      cloneVNode(
        h(CheckboxIcon, {
          __css: iconStyles.value,
          isChecked: isChecked.value,
          isIndeterminate: props.isIndeterminate,
        }),
      ),
    )

    return () => {
      const children = getValidChildren(slots)
      const hasChildren = children.length

      return h(
        beae.label,
        {
          __label: "checkbox",
          __css: {
            ...styles.value.container,
            ...rootStyles,
          },
          ...getRootProps(),
        },
        () => [
          h("input", {
            class: "beae-checkbox__input",
            ...getInputProps(),
          }),
          h(
            beae.span,
            {
              __label: "checkbox__control",
              __css: {
                ...styles.value.control,
                ...controlStyles,
              },
              ...getCheckboxProps(),
            },
            () => clonedIcon.value,
          ),
          hasChildren &&
            h(
              beae.span,
              {
                __label: "checkbox__label",
                __css: {
                  ...styles.value.label,
                },
                ...getLabelProps(),
              },
              slots,
            ),
        ],
      )
    }
  },
})
