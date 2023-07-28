import { defineStyle, defineStyleConfig } from "@beae-ui/styled-system"
import { badgeTheme, badgeVars as vars } from "./badge"

const { variants, defaultProps } = badgeTheme

const baseStyle = defineStyle({
  fontFamily: "mono",
  fontSize: "sm",
  px: "0.2em",
  borderRadius: "sm",
  bg: vars.bg.reference,
  color: vars.color.reference,
  boxShadow: vars.shadow.reference,
})

const sizes: Record<string, SystemStyleObject> = {
  lg: {
    fontSize: "lg",
    px: 6,
  },
  md: {
    fontSize: "md",
    px: 4,
  },
  sm: {
    fontSize: "sm",
    px: 3,
  },
  xs: {
    fontSize: "xs",
    px: 2,
  },
}

export const codeTheme = defineStyleConfig({
  baseStyle,
  variants,
  sizes,
  defaultProps,
})
