/**
 * 📝 Notes for Contributors:
 *
 * - When creating an interactive component, we recommend creating hooks that
 * handles accessibility, state management, and behavior concerns.
 *
 * - Hooks should return prop-getters and some state information.
 *
 * > If you're not creating an interactive component, you can delete this file.
 *
 * @see https://ui.beae.com/guides/component-guide
 */

import {
  ToRefs,
  computed,
  getCurrentInstance,
  ref,
  watch,
  watchEffect,
} from "vue"
import { useFormControlContext } from "@beae-ui/form-control"
import { trackFocusVisible } from "@zag-js/focus-visible"
import { visuallyHiddenStyle } from "@beae-ui/visually-hidden"
import { ariaAttr, callAllHandlers, dataAttr } from "@beae-ui/utils"
import { useRadioGroupContext } from "./radio-group"

export interface UseRadioProps {
  /**
   * id assigned to input
   */
  id?: string
  /**
   * The name of the input field in a radio
   * (Useful for form submission).
   */
  name?: string
  /**
   * The value to be used in the radio button.
   * This is the value that will be returned on form submission.
   */
  value?: string
  /**
   * If `true`, the radio will be checked.
   * You'll need to pass `onChange` to update its value (since it is now controlled)
   *
   * @default false
   */
  isChecked?: boolean
  /**
   * If `true`, the radio will be initially checked.
   *
   * @default false
   */
  defaultChecked?: boolean
  /**
   * If `true`, the radio will be disabled
   *
   * @default false
   */
  isDisabled?: boolean
  /**
   * If `true` and `isDisabled` is true, the radio will remain
   * focusable but not interactive.
   *
   * @default false
   */
  isFocusable?: boolean
  /**
   * If `true`, the radio will be read-only
   *
   * @default false
   */
  isReadOnly?: boolean
  /**
   * If `true`, the radio button will be invalid. This also sets `aria-invalid` to `true`.
   *
   * @default false
   */
  isInvalid?: boolean
  /**
   * If `true`, the radio button will be required. This also sets `aria-required` to `true`.
   *
   * @default false
   */
  isRequired?: boolean
  /**
   * Function called when checked state of the `input` changes
   */
  onChange?: (event: Event) => void
  /**
   * @internal
   */
  "data-radiogroup"?: any
  /**
   * Refers to the `id` of the element that labels the radio element.
   */
  "aria-describedby"?: string
}

export function useRadio(props: ToRefs<UseRadioProps>) {
  const {
    defaultChecked,
    isChecked: isCheckedProp,
    isFocusable,
    isDisabled: isDisabledProp,
    isReadOnly: isReadOnlyProp,
    isRequired: isRequiredProp,
    onChange,
    isInvalid: isInvalidProp,
    name,
    value,
    id: idProp,
    "data-radiogroup": dataRadioGroup,
    "aria-describedby": ariaDescribedBy,
    ...htmlProps
  } = props

  const uuid = `radio-${getCurrentInstance()?.uid}`

  const formControl = useFormControlContext()
  const group = useRadioGroupContext()

  const isWithinRadioGroup = !!group?.value || !!dataRadioGroup?.value
  const isWithinFormControl = !!formControl?.value

  let id =
    isWithinFormControl && !isWithinRadioGroup
      ? formControl?.value?.id?.value
      : uuid
  id = idProp?.value ?? id

  const isDisabled =
    isDisabledProp?.value ?? formControl.value?.isDisabled?.value
  const isReadOnly =
    isReadOnlyProp?.value ?? formControl.value?.isReadOnly?.value
  const isRequired =
    isRequiredProp?.value ?? formControl.value?.isRequired?.value
  const isInvalid = isInvalidProp?.value ?? formControl.value?.isInvalid?.value

  const isFocusVisible = ref<boolean>(false)
  const isFocused = ref<boolean>(false)
  const isHovered = ref<boolean>(false)
  const isActive = ref<boolean>(false)

  const isCheckedState = ref(
    Boolean(isCheckedProp?.value ?? defaultChecked?.value),
  )

  // Handle events
  const onHandleChange = (event: Event) => {
    console.log("______________________")

    if (isReadOnly || isReadOnly) {
      event.preventDefault()
      return
    }

    isCheckedState.value = (event.target as HTMLInputElement).checked
  }

  // Handle watch events
  watchEffect(() =>
    trackFocusVisible((newValue: boolean) => (isFocusVisible.value = newValue)),
  )

  const getLabelProps = (_props: any = {}) => ({
    ..._props,
    "data-disabled": dataAttr(isDisabled),
    "data-checked": dataAttr(isCheckedState.value),
    "data-invalid": dataAttr(isInvalid),
  })
  const getInputProps = (_props: any = {}) => {
    return {
      ..._props,
      type: "radio",
      name: name?.value,
      value: value?.value,
      checked: isCheckedState.value,
      readOnly: isReadOnly,
      required: isRequired,
      "aria-invalid": ariaAttr(isInvalid),
      "aria-required": ariaAttr(isRequired),
      "data-readonly": dataAttr(isReadOnly),
      "aria-describedby": ariaDescribedBy?.value,
      // style: visuallyHiddenStyle,
      onchange: callAllHandlers(props.onChange?.value, onHandleChange),
    }
  }
  const getRadioProps = (_props: any = {}) =>
    computed(() => ({
      ..._props,
      "data-active": dataAttr(isActive.value),
      "data-hover": dataAttr(isHovered.value),
      "data-disabled": dataAttr(isDisabled),
      "data-invalid": dataAttr(isInvalid),
      "data-checked": dataAttr(isCheckedState.value),
      "data-focus": dataAttr(isFocused.value),
      "data-focus-visible": dataAttr(isFocused.value && isFocusVisible.value),
      "data-readonly": dataAttr(isReadOnly),
      "aria-hidden": true,
    }))
  const getRootProps = (_props: any = {}) => ({
    ..._props,
    "data-disabled": dataAttr(isDisabled),
    "data-checked": dataAttr(isCheckedState.value),
    "data-invalid": dataAttr(isInvalid),
  })

  return {
    getLabelProps,
    getInputProps,
    getRadioProps,
    getRootProps,
    htmlProps,
  }
}

export type UseRadioReturn = ReturnType<typeof useRadio>
