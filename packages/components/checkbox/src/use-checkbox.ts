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

import { type ComputedRef, ref, computed } from "vue"
import { useFormControlContext } from "@beae-ui/form-control"
import { visuallyHiddenStyle } from "@beae-ui/visually-hidden"
import { useCheckboxGroupContext } from "./checkbox.context"
import { type UseCheckboxProps } from "./checkbox.types"
import { callAll, callAllHandlers, dataAttr } from "@beae-ui/utils"
import { stopEvent } from "./checkbox.utils"

export function useCheckbox(
  option: ComputedRef<{
    context: UseCheckboxProps
    emit: (
      event:
        | "change"
        | "mouseDown"
        | "mouseUp"
        | "mouseEnter"
        | "mouseLeave"
        | "update:modelValue",
      ...args: any[]
    ) => void
  }>,
) {
  const formControl = useFormControlContext()
  const group = useCheckboxGroupContext()

  const isCheckedState = ref(option.value.context.defaultChecked)
  const isChecked = computed(() => {
    if (group?.value?.value && option.value.context.value)
      return group?.value?.value?.value?.includes(option.value.context.value)
    return option.value.context.isChecked
  })

  const isControlled = typeof isChecked.value !== undefined
  const isCheckedComputed = computed(() =>
    isControlled ? isChecked.value : isCheckedState.value,
  )

  const isDisabled =
    option.value.context.isDisabled ??
    group.value.isDisabled ??
    formControl?.value?.isDisabled?.value
  const isReadOnly =
    option.value.context.isReadOnly ?? formControl?.value?.isReadOnly?.value
  const isRequired =
    option.value.context.isRequired ?? formControl?.value?.isRequired?.value
  const isInvalid =
    option.value.context.isInvalid ?? formControl?.value?.isInvalid?.value

  const isActive = ref<boolean>(false)
  const isFocusVisible = ref<boolean>(false)
  const isFocused = ref<boolean>(false)
  const isHovered = ref<boolean>(false)
  const isIndeterminate = ref<boolean>(!!option.value.context.isIndeterminate)

  const trulyDisabled = isDisabled && !option.value.context.isFocusable

  const onChange = ref((event: Event) => {
    option.value.emit("change", event)
    option.value.emit(
      "update:modelValue",
      (event.target as HTMLInputElement).checked,
    )
  })
  if (group.value.onChange && option.value.context.value)
    onChange.value = callAll(group.value.onChange, onChange.value)

  const onChangeHandler = (event: Event) => {
    if (isReadOnly || isDisabled) {
      event.preventDefault()
      return
    }

    if (!isControlled) {
      if (isCheckedComputed.value)
        isCheckedState.value = (event.target as HTMLInputElement).checked
      else
        isIndeterminate.value
          ? true
          : (event.target as HTMLInputElement).checked
    }

    onChange.value?.(event)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === " ") {
      isActive.value = true
    }
  }
  const onKeyUp = (event: KeyboardEvent) => {
    if (event.key === " ") {
      isActive.value = false
    }
  }

  /**
   * Bind component functions
   *
   * element props, root props, etc
   */
  const getCheckboxProps = (props: any = {}) => {
    const onPressDown = (event: MouseEvent) => {
      // On mousedown, the input blurs and returns focus to the `body`,
      // we need to prevent this. Native checkboxes keeps focus on `input`
      if (isFocused) {
        event.preventDefault()
      }
      isActive.value = true
    }

    return {
      ...props,
      "data-active": dataAttr(isActive.value),
      "data-hover": dataAttr(isHovered.value),
      "data-checked": dataAttr(isCheckedComputed.value),
      "data-focus": dataAttr(isFocused.value),
      "data-focus-visible": dataAttr(isFocused.value && isFocusVisible.value),
      "data-indeterminate": dataAttr(isIndeterminate.value),
      "data-disabled": dataAttr(isDisabled),
      "data-invalid": dataAttr(isInvalid),
      "data-readonly": dataAttr(isReadOnly),
      "aria-hidden": true,
      onMouseDown: onPressDown,
      onMouseUp: () => (isActive.value = false),
      onMouseEnter: () => (isHovered.value = true),
      onMouseLeave: () => (isHovered.value = false),
    }
  }

  const getLabelProps = (props: any = {}) => ({
    ...props,
    onMouseDown: stopEvent,
    "data-disabled": dataAttr(isDisabled),
    "data-checked": dataAttr(isCheckedComputed.value),
    "data-invalid": dataAttr(isInvalid),
  })

  const getInputProps = (props: any = {}) => ({
    ...props,
    type: "checkbox",
    name: option.value.context.name,
    value: option.value.context.value,
    id: formControl?.value.id,
    tabIndex: option.value.context.tabIndex,
    onChange: onChangeHandler,
    onBlur: callAllHandlers(
      formControl?.value?.onBlur,
      () => (isFocused.value = false),
    ),
    onFocus: callAllHandlers(
      formControl?.value?.onBlur,
      () => (isFocused.value = true),
    ),
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp,
    required: isRequired,
    checked: isCheckedComputed.value,
    disabled: trulyDisabled,
    readOnly: isReadOnly,
    "aria-label": option.value.context["aria-label"],
    "aria-labelledby": option.value.context["aria-labelledby"],
    "aria-invalid": option.value.context["aria-invalid"]
      ? Boolean(option.value.context["aria-invalid"])
      : formControl?.value?.isInvalid,
    "aria-describedby": option.value.context["aria-describedby"],
    "aria-disabled": isDisabled,
    style: visuallyHiddenStyle,
  })

  const getRootProps = (props: any = {}) => ({
    ...props,
    "data-disabled": dataAttr(isDisabled),
    "data-checked": dataAttr(isCheckedComputed.value),
    "data-invalid": dataAttr(isInvalid),
  })

  return {
    getCheckboxProps,
    getLabelProps,
    getInputProps,
    getRootProps,
    isChecked: isCheckedComputed,
  }
}

export type UseCheckboxReturn = ReturnType<typeof useCheckbox>
