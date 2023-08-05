import { type InputHTMLAttributes } from "vue"
import { type ThemingProps, type HTMLBeaeProps } from "@beae-ui/system"
import { type SystemProps } from "@beae-ui/styled-system"

export type EventOrValue = Event | string | number

/*************************************************************************
 * START: RADIO TYPES
 *************************************************************************/

type radioOmitted = "onChange" | "defaultChecked" | "checked"
interface BaseControlProps extends Omit<HTMLBeaeProps<"div">, radioOmitted> {}

export interface RadioProps
  extends UseRadioProps,
    ThemingProps<"Radio">,
    BaseControlProps {
  /**
   * The spacing between the checkbox and its label text
   * @default 0.5rem
   * @type SystemProps["marginLeft"]
   */
  spacing?: SystemProps["marginLeft"]
  /**
   * Additional props to be forwarded to the `input` element
   */
  inputProps?: InputHTMLAttributes
}

/**
 * @todo use the `useClickable` hook here
 * to manage the isFocusable & isDisabled props
 */
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

export interface RadioState {
  isInvalid: boolean | undefined
  isFocused: boolean
  isChecked: boolean
  isActive: boolean
  isHovered: boolean
  isDisabled: boolean | undefined
  isReadOnly: boolean | undefined
  isRequired: boolean | undefined
}

/*************************************************************************
 * END: RADIO TYPES
 *************************************************************************/

/*************************************************************************
 * START: RADIO GROUP TYPES
 *************************************************************************/

type radioGroupOmitted = "value" | "defaultValue" | "defaultChecked"
export interface RadioGroupProps
  extends UseRadioGroupProps,
    Omit<HTMLBeaeProps<"div">, radioGroupOmitted>,
    Omit<ThemingProps<"Radio">, "orientation"> {}

export interface UseRadioGroupProps {
  /**
   * The value of the radio to be modeValue binding two way
   * (in controlled mode)
   */
  modelValue?: string
  /**
   * The value of the radio to be `checked`
   * (in controlled mode)
   */
  value?: string
  /**
   * The value of the radio to be `checked`
   * initially (in uncontrolled mode)
   */
  defaultValue?: string
  /**
   * If `true`, all wrapped radio inputs will be disabled
   *
   * @default false
   */
  isDisabled?: boolean
  /**
   * If `true` and `isDisabled` is true, all wrapped radio inputs will remain
   * focusable but not interactive.
   *
   * @default false
   */
  isFocusable?: boolean
  /**
   * The `name` attribute forwarded to each `radio` element
   */
  name?: string
  /**
   * If `true`, input elements will receive
   * `checked` attribute instead of `isChecked`.
   *
   * This assumes, you're using native radio inputs
   *
   * @default false
   */
  isNative?: boolean
}

/*************************************************************************
 * END: RADIO GROUP TYPES
 *************************************************************************/
