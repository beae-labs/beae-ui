import { type ComputedRef } from "vue"
import { type ThemingProps, type HTMLBeaeProps } from "@beae-ui/system"
import { type SystemProps } from "@beae-ui/styled-system"
import { useCheckboxGroup } from "./use-checkbox-group"

export interface CheckboxIconProps {
  isIndeterminate?: boolean
  isChecked?: boolean
}

export type EventOrValue = Event | string | number

export type UseCheckboxGroupProps = ComputedRef<{
  context: CheckboxGroupContext
  emit: CallableFunction
}>

export interface CheckboxGroupProps
  extends CheckboxGroupContext,
    Omit<ThemingProps<"Checkbox">, "orientation"> {
  /**
   * The value of the checkbox group
   */
  modelValue: string[] | number[]

  /**
   * If `true`, all wrapped checkbox inputs will be disabled
   */
  isDisabled?: boolean
}

export type CheckboxGroupContext = ComputedRef<
  Pick<CheckboxGroupProps, "isDisabled" | "modelValue"> &
    Omit<ThemingProps<"Checkbox">, "orientation"> & {
      "onUpdate:modelValue"?: (...args: any[]) => any
    }
>

export type UseCheckboxGroupReturn = ReturnType<typeof useCheckboxGroup>

/****************************************************************************
 * START: Checkbox Types
 ****************************************************************************/

export interface CheckboxControlProps {
  isIndeterminate?: boolean
  /**
   * If `true`, the checkbox will be disabled
   */
  isDisabled?: boolean
  /**
   * If `true` and `disabled` is passed, the checkbox will
   * remain tabbable but not interactive
   */
  isFocusable?: boolean
  /**
   * If `true`, the checkbox will be readonly
   */
  isReadonly?: boolean
  /**
   * If `true`, the checkbox is marked as invalid.
   */
  isInvalid?: boolean
  /**
   * If `true`, the checkbox input is marked as required,
   */
  isRequired?: boolean
  /**
   * The name of the input field in a checkbox
   * (Useful for form submission).
   */
  name?: string
  /**
   * The value to be used in the checkbox input.
   * This is the value that will be returned on form submission.
   */
  value?: string | number
  /**
   * Defines the string that labels the checkbox element.
   */
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-invalid"?: boolean
  "aria-describedby"?: string
  tabIndex?: number | string
}

export interface CheckboxProps
  extends HTMLBeaeProps<"input">,
    ThemingProps<"Checkbox">,
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
   * The checked icon to use
   */
  icon?: any
  /**
   * Additional props to be forwarded to the `input` element
   */
  inputProps?: HTMLBeaeProps<"input">
}

export interface UseCheckboxProps {
  context: {
    /**
     * If `true`, the checkbox will be checked.
     * You'll need to pass `onChange` to update its value (since it is now controlled)
     */
    isChecked?: boolean
    /**
     * If `true`, the checkbox will be indeterminate.
     * This only affects the icon shown inside checkbox
     * and does not modify the isChecked property.
     */
    isIndeterminate?: boolean
    /**
     * If `true`, the checkbox will be disabled
     */
    isDisabled?: boolean
    /**
     * If `true` and `isDisabled` is passed, the checkbox will
     * remain tabbable but not interactive
     */
    isFocusable?: boolean
    /**
     * If `true`, the checkbox will be readonly
     */
    isReadOnly?: boolean
    /**
     * If `true`, the checkbox is marked as invalid.
     * Changes style of unchecked state.
     */
    isInvalid?: boolean
    /**
     * If `true`, the checkbox input is marked as required,
     * and `required` attribute will be added
     */
    isRequired?: boolean
    /**
     * If `true`, the checkbox will be initially checked.
     */
    defaultChecked?: boolean
    /**
     * The name of the input field in a checkbox
     * (Useful for form submission).
     */
    name?: string
    /**
     * The value to be used in the checkbox input.
     * This is the value that will be returned on form submission.
     */
    value?: string | number
    /**
     * id assigned to input
     */
    id?: string
    /**
     * Defines the string that labels the checkbox element.
     */
    "aria-label"?: string
    /**
     * Refers to the `id` of the element that labels the checkbox element.
     */
    "aria-labelledby"?: string
    "aria-invalid"?: true | undefined
    "aria-describedby"?: string
    tabIndex?: number | string
  }
  emit: CallableFunction
}

/****************************************************************************
 * END: Checkbox Types
 ****************************************************************************/
