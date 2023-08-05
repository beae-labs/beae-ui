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
  type ComputedRef,
  computed,
  getCurrentInstance,
  ref,
  watchEffect,
} from "vue"
import { useFormControlContext } from "@beae-ui/form-control"
import { trackFocusVisible } from "@zag-js/focus-visible"
import { ariaAttr, dataAttr } from "@beae-ui/utils"
import { callAll } from "@beae-ui/shared-utils"
import { useRadioGroupContext } from "./radio.context"
import { type UseRadioProps } from "./radio.types"
import { visuallyHiddenStyle } from "@beae-ui/visually-hidden"

export function useRadio(
  option: ComputedRef<{
    context: UseRadioProps
    emit: (event: string, ...args: any[]) => void
  }>,
) {
  const formControl = useFormControlContext()
  const group = useRadioGroupContext()

  const isWithinFormControl = !!formControl?.value
  const isWithinRadioGroup =
    !!group?.value || !!option.value.context["data-radiogroup"]

  const isCheckedState = ref(option.value.context.defaultChecked)
  const isChecked = computed(() => {
    if (group?.value?.value && option.value.context.value)
      return group?.value.value.value === option.value.context.value
    return option.value.context.isChecked
  })
  const isControlled = typeof isChecked.value !== undefined
  const isCheckedComputed = computed(() =>
    isControlled ? isChecked.value : isCheckedState.value,
  )

  const onChange = ref((event: Event) => {
    option.value.emit("change", event)
    option.value.emit(
      "update:modelValue",
      (event.target as HTMLInputElement).checked,
    )
  })
  if (group.value.onChange && option.value.context.value)
    onChange.value = callAll(group.value.onChange, onChange.value)

  const name = option.value.context.name ?? group.value.name
  const uuid = `radio-${getCurrentInstance()?.uid}`

  const id =
    option.value.context.id ??
    (isWithinFormControl && !isWithinRadioGroup
      ? formControl.value.id.value
      : uuid)

  const isDisabled =
    option.value.context.isDisabled ??
    group.value.isDisabled ??
    formControl.value?.isDisabled?.value
  const isReadOnly =
    option.value.context.isReadOnly ?? formControl.value?.isReadOnly?.value
  const isRequired =
    option.value.context.isRequired ?? formControl.value?.isRequired?.value
  const isInvalid =
    option.value.context.isInvalid ?? formControl.value?.isInvalid?.value

  const isFocusVisible = ref<boolean>(false)
  const isFocused = ref<boolean>(false)
  const isHovered = ref<boolean>(false)
  const isActive = ref<boolean>(false)

  // Handle events
  const onChangeHandler = (event: Event) => {
    if (isReadOnly || isDisabled) {
      event.preventDefault()
      return
    }

    if (!isControlled)
      isCheckedState.value = (event.target as HTMLInputElement).checked

    onChange.value?.(event)
  }

  // Handle watch events
  watchEffect(() => {
    trackFocusVisible((newValue: boolean) => (isFocusVisible.value = newValue))
  })

  const getLabelProps = (props: any = {}) => ({
    ...props,
    "data-disabled": dataAttr(isDisabled),
    "data-checked": dataAttr(isCheckedComputed.value),
    "data-invalid": dataAttr(isInvalid),
  })
  const getInputProps = (props: any = {}) => {
    return {
      ...props,
      id,
      name,
      type: "radio",
      value: option.value.context.value,
      checked: isCheckedComputed.value,
      readOnly: isReadOnly,
      required: isRequired,
      "aria-invalid": ariaAttr(isInvalid),
      "aria-required": ariaAttr(isRequired),
      "data-readonly": dataAttr(isReadOnly),
      "aria-describedby": option.value.context["aria-describedby"],
      style: visuallyHiddenStyle,
      onchange: onChangeHandler,
    }
  }
  const getRadioProps = (props: any = {}) =>
    computed(() => ({
      ...props,
      "data-active": dataAttr(isActive.value),
      "data-hover": dataAttr(isHovered.value),
      "data-disabled": dataAttr(isDisabled),
      "data-invalid": dataAttr(isInvalid),
      "data-checked": dataAttr(isCheckedComputed.value),
      "data-focus": dataAttr(isFocused.value),
      "data-focus-visible": dataAttr(isFocused.value && isFocusVisible.value),
      "data-readonly": dataAttr(isReadOnly),
      "aria-hidden": true,
    }))
  const getRootProps = (props: any = {}) => ({
    ...props,
    "data-disabled": dataAttr(isDisabled),
    "data-checked": dataAttr(isCheckedComputed.value),
    "data-invalid": dataAttr(isInvalid),
  })

  return {
    getLabelProps,
    getInputProps,
    getRadioProps,
    getRootProps,
    group,
  }
}

export type UseRadioReturn = ReturnType<typeof useRadio>
