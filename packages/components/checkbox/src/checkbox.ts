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

import { PropType, cloneVNode, computed, defineComponent, h, toRefs } from "vue"
import {
  ComponentWithProps,
  DeepPartial,
  HTMLBeaeProps,
  SystemProps,
  SystemStyleObject,
  ThemingProps,
  beae,
  omitThemingProps,
  useMultiStyleConfig,
} from "@beae-ui/system"
import { useCheckboxGroupContext } from "./checkbox-group"
import { SNAO, callAll, getValidChildren, mergeWith } from "@beae-ui/utils"
import { vueThemingProps } from "@beae-ui/prop-utils"
import { CheckboxIcon } from "./checkbox-icon"
import { UseCheckboxProps, useCheckbox } from "./use-checkbox"

type CheckboxControlProps = Omit<HTMLBeaeProps<"div">, keyof UseCheckboxProps>

export interface CheckboxProps
  extends HTMLBeaeProps<"input">,
    ThemingProps<"Checkbox">,
    UseCheckboxProps,
    CheckboxControlProps {
  /**
   * The spacing between the checkbox and its label text
   * @default 0.5rem
   * @type SystemProps["marginLeft"]
   */
  spacing?: SystemProps["marginLeft"]
  /**
   * The color of the checkbox icon when checked or indeterminate
   */
  iconColor?: string
  /**
   * The size of the checkbox icon when checked or indeterminate
   */
  iconSize?: string | number
  /**
   * Additional props to be forwarded to the `input` element
   */
  inputProps?: HTMLBeaeProps<"input">
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
export const Checkbox: ComponentWithProps<DeepPartial<CheckboxProps>> =
  defineComponent({
    name: "Checkbox",
    props: {
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
    },
    emits: ["change", "update:modelValue"],
    setup(props, { attrs, slots }) {
      // define primary data
      const group = useCheckboxGroupContext()
      const mergedProps: CheckboxProps = mergeWith(
        {},
        group.value,
        props,
        attrs,
      )
      const ownProps = omitThemingProps(props)

      const {
        spacing = "0.5rem",
        iconColor,
        iconSize,
        isChecked: isCheckedProp,
        isDisabled = group?.value?.isDisabled,
        onChange: onChangeProp,
        inputProps,
        ...rest
      } = ownProps

      let isChecked = isCheckedProp
      if (group.value.value && ownProps.value) {
        isChecked = group.value.value.includes(ownProps.value)
      }

      let onChange = onChangeProp
      if (group.value.onChange && ownProps.value) {
        onChange = callAll([group.value.onChange, onChangeProp])
      }

      const {
        state,
        getInputProps,
        getCheckboxProps,
        getLabelProps,
        getRootProps,
      } = useCheckbox(toRefs({ ...rest, isDisabled, isChecked, onChange }))

      // define styles
      const styles = useMultiStyleConfig("Checkbox", mergedProps)
      const rootStyles: SystemStyleObject = {
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "top",
        position: "relative",
      }
      const controlStyles: SystemStyleObject = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        verticalAlign: "top",
        userSelect: "none",
        flexShrink: 0,
      }
      const iconStyles = computed<SystemStyleObject>(() => ({
        fontSize: props.iconSize,
        color: props.iconColor,
      }))

      // render some component before make return () => h()
      const clonedIcon = computed(() =>
        cloneVNode(
          h(CheckboxIcon, {
            __css: iconStyles.value,
            isChecked,
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
            h(beae.input, {
              __label: "checkbox__input",
              ...getInputProps(inputProps),
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
                    marginStart: spacing,
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
