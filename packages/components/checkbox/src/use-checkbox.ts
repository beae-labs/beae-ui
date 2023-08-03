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

import { type ComputedRef, ref, watchEffect, watch } from "vue"
import { useFormControlProps } from "@beae-ui/form-control"
import { callAllHandlers, dataAttr, omit } from "@beae-ui/utils"
import { trackFocusVisible } from "@zag-js/focus-visible"
import { visuallyHiddenStyle } from "@beae-ui/visually-hidden"
import { type UseCheckboxProps } from "./checkbox.types"

/**
 * useCheckbox that provides all the state and focus management logic
 * for a checkbox. It is consumed by the `Checkbox` component
 *
 * @see Docs https://ui.beae.com/checkbox#hooks
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 */
export function useCheckbox(useCheckboxProps: ComputedRef<UseCheckboxProps>) {
  const useCheckboxContextProps = useCheckboxProps.value.context

  const state = ref({
    isInvalid: useCheckboxContextProps.isInvalid,
    isFocused: useCheckboxContextProps.isFocusable,
    isChecked: useCheckboxContextProps.isChecked,
    isIndeterminate: useCheckboxContextProps.isIndeterminate,
    isDisabled: useCheckboxContextProps.isDisabled,
    isReadOnly: useCheckboxContextProps.isReadOnly,
    isRequired: useCheckboxContextProps.isRequired,
  })

  const formControlProps = useFormControlProps(props.value.context)
  const {
    isDisabled,
    isReadOnly,
    isRequired,
    isInvalid,
    id,
    "aria-describedby": ariaDescribedBy,
  } = formControlProps

  // filter props to get html properties
  const htmlProps = omit(rest, [
    "isDisabled",
    "isReadOnly",
    "isRequired",
    "isInvalid",
    "id",
    "onBlur",
    "onFocus",
    "aria-describedby",
  ])

  const isFocusVisible = ref<boolean>(false)
  const isFocused = ref<boolean>(false)
  const isHovered = ref<boolean>(false)
  const isActive = ref<boolean>(false)

  // Track focus when visible
  watchEffect(() =>
    trackFocusVisible((newValue: boolean) => (isFocusVisible.value = newValue)),
  )

  // interact with input[type="checkbox"]
  const inputRef = ref<HTMLInputElement>()
  const rootIsLabelElement = ref<boolean>(true)
  const checkedState = ref<boolean>(!!useCheckboxContextProps.defaultChecked)
  const isControlled = checkedProp !== undefined
  const isChecked = isControlled ? checkedProp : checkedState

  const handleChange = (event: Event) => {
    if (isReadOnly?.value || isDisabled?.value) {
      event.preventDefault()
      return
    }

    if (!isControlled) {
      if (isChecked.value)
        checkedState.value = (event.target as HTMLInputElement).checked
      else
        checkedState.value = isIndeterminate?.value
          ? true
          : (event.target as HTMLInputElement).checked
    }

    onChangeProp.value?.value?.(event)
  }

  /**
   * Prevent `onBlur` being fired when the checkbox label is touched
   */
  const stopEvent = (event: Event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  // watch([isIndeterminate], () => {
  //   if (isChecked.value && inputRef.value)
  //     inputRef.value["indeterminate"] = Boolean(isIndeterminate?.value)
  // })

  // watch([isDisabled], () => {
  //   if (isDisabled?.value) isFocused.value = false
  // })

  /**
   * HTMLFormElement.reset() should reset the checkbox state
   */
  watchEffect(() => {
    const element = inputRef?.value

    if (element?.form) return

    const formResetListener = () =>
      (checkedState.value = !!defaultChecked?.value)
    element?.form?.addEventListener("reset", formResetListener)
    return () => element?.form?.removeEventListener("reset", formResetListener)
  })

  const trulyDisabled = isDisabled?.value && !isFocusable?.value

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === " ") isActive.value = true
  }

  const onKeyUp = (event: KeyboardEvent) => {
    if (event.key === " ") isActive.value = false
  }

  /**
   * Sync state with uncontrolled form libraries like `react-hook-form`.
   *
   * These libraries set the checked value for input fields
   * using their refs. For the checkbox, it sets `ref.current.checked = true | false` directly.
   *
   * This means the `isChecked` state will get out of sync with `ref.current.checked`,
   * even though the input validation with work, the UI will not be up to date.
   *
   * Let's correct that by checking and syncing the state accordingly.
   */
  watch(inputRef, () => {
    if (!inputRef.value) return
    const notInSync = inputRef.value.checked !== isChecked.value
    if (notInSync) checkedState.value = inputRef.value.checked
  })

  // Get element props
  const getCheckboxProps = (_props: any = {}) => {
    const onPressDown = (event: MouseEvent) => {
      // On mousedown, the input blurs and returns focus to the `body`,
      // we need to prevent this. Native checkboxes keeps focus on `input`
      if (isFocused.value) {
        event.preventDefault()
      }
      isActive.value = true
    }

    return {
      ..._props,
      "data-active": dataAttr(isActive.value),
      "data-hover": dataAttr(isHovered.value),
      "data-checked": dataAttr(isChecked.value),
      "data-focus": dataAttr(isFocused.value),
      "data-focus-visible": dataAttr(isFocused.value && isFocusVisible.value),
      "data-indeterminate": dataAttr(isIndeterminate?.value),
      "data-disabled": dataAttr(isDisabled?.value),
      "data-invalid": dataAttr(isInvalid?.value),
      "data-readonly": dataAttr(isReadOnly?.value),
      "aria-hidden": true,
      onMouseDown: callAllHandlers(_props.onMouseDown, onPressDown),
      onMouseUp: callAllHandlers(
        _props.onMouseUp,
        () => (isActive.value = false),
      ),
      onMouseEnter: callAllHandlers(
        _props.onMouseEnter,
        () => (isHovered.value = true),
      ),
      onMouseLeave: callAllHandlers(
        _props.onMouseLeave,
        () => (isHovered.value = false),
      ),
    }
  }
  const getIndicatorProps = (_props: any = {}) => ({
    ..._props,
    "data-active": dataAttr(isActive.value),
    "data-hover": dataAttr(isHovered.value),
    "data-checked": dataAttr(isChecked.value),
    "data-focus": dataAttr(isFocused.value),
    "data-focus-visible": dataAttr(isFocused.value && isFocusVisible.value),
    "data-indeterminate": dataAttr(isIndeterminate?.value),
    "data-disabled": dataAttr(isDisabled?.value),
    "data-invalid": dataAttr(isInvalid?.value),
    "data-readonly": dataAttr(isReadOnly?.value),
  })
  const getRootProps = (_props: any = {}) => ({
    ...htmlProps,
    ..._props,
    onClick: callAllHandlers(_props.onClick, () => {
      /**
       * Accessibility:
       *
       * Ideally, `getRootProps` should be spread unto a `label` element.
       *
       * If the element was changed using the `as` prop or changing
       * the dom node `getRootProps` is spread unto (to a `div` or `span`), we'll trigger
       * click on the input when the element is clicked.
       * @see Issue https://github.com/beae-ui/beae-ui/issues/3480
       */
      if (!rootIsLabelElement) {
        inputRef.value?.click()
        requestAnimationFrame(() => {
          inputRef.value?.focus({ preventScroll: true })
        })
      }
    }),
    "data-disabled": dataAttr(isDisabled?.value),
    "data-checked": dataAttr(isChecked?.value),
    "data-invalid": dataAttr(isInvalid?.value),
  })
  const getInputProps = (_props: any = {}) => ({
    ..._props,
    type: "checkbox",
    name,
    value,
    id,
    tabIndex,
    onChange: callAllHandlers(_props.onChange, handleChange),
    onBlur: callAllHandlers(
      _props.onBlur,
      onBlurProp,
      () => (isFocused.value = false),
    ),
    onFocus: callAllHandlers(
      _props.onFocus,
      onFocusProp,
      () => (isFocused.value = true),
    ),
    onKeyDown: callAllHandlers(_props.onKeyDown, onKeyDown),
    onKeyUp: callAllHandlers(_props.onKeyUp, onKeyUp),
    required: isRequired,
    checked: isChecked,
    disabled: trulyDisabled,
    readOnly: isReadOnly,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-invalid": ariaInvalid ? Boolean(ariaInvalid) : isInvalid,
    "aria-describedby": ariaDescribedBy,
    "aria-disabled": isDisabled,
    style: visuallyHiddenStyle,
  })
  const getLabelProps = (_props: any = {}) => ({
    ..._props,
    onMouseDown: callAllHandlers(_props.onMouseDown, stopEvent),
    "data-disabled": dataAttr(isDisabled?.value),
    "data-checked": dataAttr(isChecked?.value),
    "data-invalid": dataAttr(isInvalid?.value),
  })

  // Create state to manage checkbox
  const state = {
    isInvalid: isInvalid?.value,
    isFocused: isFocused.value,
    isChecked: !!isChecked?.value,
    isActive: isActive.value,
    isHovered: isHovered.value,
    isIndeterminate: isIndeterminate?.value,
    isDisabled: isDisabled?.value,
    isReadOnly: isReadOnly?.value,
    isRequired: isRequired?.value,
  }

  return {
    state,
    getRootProps,
    getCheckboxProps,
    getIndicatorProps,
    getInputProps,
    getLabelProps,
    htmlProps,
    value: true,
  }
}

export type UseCheckboxReturn = ReturnType<typeof useCheckbox>
