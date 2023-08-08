import { type SystemProps } from "@beae-ui/styled-system"
import { BaseThemedComponentProps } from "@beae-ui/prop-utils"

type ButtonTypes = "button" | "reset" | "submit"

export interface ButtonOptions extends BaseThemedComponentProps {
  isLoading?: boolean
  isDisabled?: boolean
  isActive?: boolean
  loadingText?: string
  isFullWidth?: boolean
  type?: ButtonTypes
  leftIcon?: string
  rightIcon?: string
  spinnerPlacement?: "start" | "end"
  iconSpacing?: SystemProps["marginRight"]
}

export const defaultButtonProps = {
  as: "button",
  iconSpacing: "0.5rem",
}
