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
  defineComponent,
  h,
  computed,
  reactive,
  toRefs,
} from "vue"
import {
  type AnatomyParts,
  useMultiStyleConfig,
  omitThemingProps,
  beae,
} from "@beae-ui/system"
import { SAO, vueThemingProps } from "@beae-ui/prop-utils"
import { type SelectProps } from "./select.types"
import { useFormControl } from "@beae-ui/form-control"
import { DefaultSelectIcon, SelectIcon } from "./select-icon"
import { SelectField } from "./select-field"

export const Select = defineComponent({
  name: "Select",
  props: {
    color: String,
    placeholder: String,
    iconColor: String as PropType<SelectProps["iconColor"]>,
    isDisabled: Boolean as PropType<SelectProps["isDisabled"]>,
    isInvalid: Boolean as PropType<SelectProps["isInvalid"]>,
    focusBorderColor: SAO as PropType<SelectProps["focusBorderColor"]>,
    errorBorderColor: SAO as PropType<SelectProps["errorBorderColor"]>,
    modelValue: [String, Number] as PropType<string | number>,
    ...vueThemingProps,
  },
  emits: ["update:modelValue"],
  setup(props, { slots, attrs, emit }) {
    const styles = useMultiStyleConfig<AnatomyParts.Select>("Select", props)

    const ownProps = computed(() => toRefs(reactive(omitThemingProps(props))))

    const formControl = useFormControl(ownProps.value)

    function onChange(event: Event) {
      emit("update:modelValue", (event.target as HTMLSelectElement)?.value)
    }

    const SelectIconComputed = computed(() => {
      return slots?.icon?.() || [h(DefaultSelectIcon)]
    })

    const rootStyles = computed(() => ({
      width: "100%",
      height: "fit-content",
      position: "relative",
      color: props.color,
    }))

    const fieldStyles = computed(() => ({
      paddingEnd: "2rem",
      ...styles.value.field,
      _focus: {
        zIndex: "unset",
        ...(styles as any).value.field?.["_focus"],
      },
    }))

    const iconColor = computed(() => props.iconColor ?? props.color)

    return () =>
      h(
        beae.div,
        {
          __css: rootStyles.value,
        },
        () => [
          h(SelectField, {
            __css: fieldStyles.value,
            placeholder: props.placeholder,
            ...attrs,
            ...formControl.value,
            onChange,
            value: props.modelValue,
          }),
          h(
            SelectIcon,
            {
              "data-disabled": formControl.value.disabled,
              ...formControl.value,
              color: iconColor.value,
              __css: styles.value.icon,
            },
            SelectIconComputed.value,
          ),
        ],
      )
  },
})
