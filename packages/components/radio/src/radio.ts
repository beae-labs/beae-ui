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

import { type PropType, defineComponent, h, computed } from "vue"
import {
  type SystemStyleObject,
  useMultiStyleConfig,
  omitThemingProps,
  beae,
} from "@beae-ui/system"
import { useRadio } from "./use-radio"
import { vueThemingProps } from "@beae-ui/prop-utils"
import { getValidChildren } from "@beae-ui/utils"
import { type RadioProps } from "./radio.types"

/**
 * Radio component is used in forms when a user needs to select a single value from
 * several options.
 *
 * @see Docs https://ui.beae.com/radio
 */
export const Radio = defineComponent({
  name: "Radio",
  props: {
    id: String as PropType<RadioProps["id"]>,
    name: String as PropType<RadioProps["name"]>,
    spacing: [String, Number] as PropType<RadioProps["spacing"]>,
    inputProps: Object as PropType<RadioProps["inputProps"]>,
    value: String as PropType<RadioProps["value"]>,
    defaultChecked: Boolean as PropType<RadioProps["defaultChecked"]>,
    isChecked: Boolean as PropType<RadioProps["isChecked"]>,
    isDisabled: Boolean as PropType<RadioProps["isDisabled"]>,
    isFocusable: Boolean as PropType<RadioProps["isFocusable"]>,
    isReadOnly: Boolean as PropType<RadioProps["isReadOnly"]>,
    isInvalid: Boolean as PropType<RadioProps["isInvalid"]>,
    isRequired: Boolean as PropType<RadioProps["isRequired"]>,
    dataRadiogroup: [String, Number, Object, Function] as PropType<
      RadioProps["data-radiogroup"]
    >,
    ariaDescribedby: String as PropType<RadioProps["aria-describedby"]>,
    modelValue: String as PropType<string>,
    ...vueThemingProps,
  },
  emits: ["change", "update:modelValue"],
  setup(props, { emit, slots }) {
    const ownProps = omitThemingProps(props)

    const { spacing = "0.5rem", inputProps: htmlInputProps, ...rest } = ownProps

    ///
    // Interact use-radio hooks
    ///
    const useRadioOptionComputed: any = computed(() => ({
      context: rest,
      emit,
    }))
    const { getLabelProps, getInputProps, getRadioProps, getRootProps, group } =
      useRadio(useRadioOptionComputed)

    const styles = useMultiStyleConfig("Radio", { ...group.value, ...props })
    const rootStyles: SystemStyleObject = {
      display: "inline-flex",
      alignItems: "center",
      verticalAlign: "top",
      cursor: "pointer",
      position: "relative",
      ...styles.value?.container,
    }
    const checkboxStyles: SystemStyleObject = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      ...styles.value?.control,
    }
    const labelStyles: SystemStyleObject = {
      userSelect: "none",
      marginStart: spacing,
      ...styles.value?.label,
    }

    return () => {
      const children = getValidChildren(slots)
      const hasChildren = children.length

      const labelProps = getLabelProps()
      const inputProps = getInputProps(htmlInputProps)
      const radioProps = getRadioProps()

      return h(
        beae.label,
        {
          __label: "radio",
          __css: rootStyles,
          ...Object.assign({}, getRootProps()),
        },
        () => [
          h(beae.input, {
            __label: "radio__input",
            ...inputProps,
          }),
          h(beae.span, {
            __label: "radio__control",
            __css: checkboxStyles,
            ...radioProps.value,
          }),
          hasChildren &&
            h(
              beae.span,
              {
                __label: "radio__label",
                __css: labelStyles,
                ...labelProps,
              },
              slots,
            ),
        ],
      )
    }
  },
})
