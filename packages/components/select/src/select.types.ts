import { type FormControlOptions } from "@beae-ui/form-control"
import { type ThemingProps, type HTMLBeaeProps } from "@beae-ui/system"
import { type SelectHTMLAttributes } from "vue"

type Omitted = "disabled" | "required" | "readOnly" | "size"

export interface SelectFieldProps
  extends Omit<HTMLBeaeProps<SelectHTMLAttributes>, Omitted> {
  /**
   * @default false
   */
  isDisabled?: boolean
}

interface RootProps extends Omit<HTMLBeaeProps<"div">, "color"> {}

interface SelectOptions extends FormControlOptions {
  /**
   * The border color when the select is focused. Use color keys in `theme.colors`
   * @example
   * focusBorderColor = "blue.500"
   */
  focusBorderColor?: string
  /**
   * The border color when the select is invalid. Use color keys in `theme.colors`
   * @example
   * errorBorderColor = "red.500"
   */
  errorBorderColor?: string
  /**
   * The placeholder for the select. We render an `<option/>` element that has
   * empty value.
   *
   * ```jsx
   * <option value="">{placeholder}</option>
   * ```
   */
  placeholder?: string
  /**
   * The size (width and height) of the icon
   */
  iconSize?: string
  /**
   * The color of the icon
   */
  iconColor?: string
}

export interface SelectProps
  extends SelectFieldProps,
    ThemingProps<"Select">,
    SelectOptions {
  /**
   * Props to forward to the root `div` element
   */
  rootProps?: RootProps
}
