import { mode, transparentize } from "@beae-ui/theme-tools"
import type {
  SystemStyleObject,
  SystemStyleFunction,
} from "@beae-ui/theme-tools"

type AccessibleColor = {
  bg?: string
  color?: string
  hoverBg?: string
  activeBg?: string
}

/** Accessible color overrides for less accessible colors. */
const accessibleColorMap: { [key: string]: AccessibleColor } = {
  yellow: {
    bg: "yellow.400",
    color: "black",
    hoverBg: "yellow.500",
    activeBg: "yellow.600",
  },
  cyan: {
    bg: "cyan.400",
    color: "black",
    hoverBg: "cyan.500",
    activeBg: "cyan.600",
  },
}
const baseStyle: SystemStyleObject = {
  lineHeight: "1",
  borderRadius: "base",
  fontWeight: "medium",
  transitionProperty: "common",
  transitionDuration: "normal",
  _focusVisible: {
    boxShadow: "outline",
  },
  _disabled: {
    opacity: 0.4,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  _hover: {
    _disabled: {
      bg: "initial",
    },
  },
}

const variantDefault: SystemStyleObject = {
  bg: "white",
  border: "1px solid",
  borderColor: mode(`polaris.gray.600`, `whiteAlpha.300`),
  boxShadow: "sm",
  color: mode(`polaris.gray.900`, `whiteAlpha.900`),
  _hover: {
    bg: "polaris.gray.200",
  },
  _active: { bg: mode(`gray.200`, `whiteAlpha.300`) },
}

const variantOutline: SystemStyleObject = {
  ...variantDefault,
  bg: "transparent",
}

const variantOutlineMonochrome: SystemStyleObject = {
  ...variantDefault,
  bg: "transparent",
  color: "#bf0711",
  borderColor: "currentColor",
  boxShadow: "0 0 0 0.0625rem currentColor",
  position: "relative",
  _before: {
    content: '""',
    position: "absolute",
    top: "0px",
    left: "0px",
    right: "0px",
    bottom: "0px",
    bg: "currentColor",
    opacity: "0",
  },
  _hover: {
    _before: {
      opacity: "0.05",
    },
  },
}

const variantPlain: SystemStyleObject = {
  bg: "transparent",
  border: "none",
  color: "polaris.blue.600",
  fontWeight: "normal",
  _hover: {
    textDecoration: "underline",
    color: "polaris.blue.700",
  },
}

const variantPlainMonochrome: SystemStyleFunction = (props) => {
  return {
    bg: "transparent",
    border: "none",
    fontWeight: "normal",
    textDecoration: "underline",
    minW: "8",
    px: "3",
    py: "2",
    mx: "-3",
    my: "-2",
    lineHeight: "1",
    height: "auto",
  }
}

const variantPlainDestructive: SystemStyleFunction = () => {
  return {
    ...variantPlain,
    color: "polaris.red.600",
    _hover: {
      textDecoration: "underline",
      color: "polaris.red.700",
    },
  }
}

const variantPrimary: SystemStyleFunction = () => {
  return {
    color: "white",
    bg: "polaris.green.700",
    _hover: {
      bg: "polaris.green.800",
    },
    _active: {
      bg: "polaris.green.900",
    },
  }
}

const variantDestructive: SystemStyleFunction = () => {
  return {
    color: "white",
    bg: "polaris.red.600",
    _hover: {
      bg: "polaris.red.700",
    },
    _active: {
      bg: "polaris.red.800",
    },
  }
}

const variants = {
  default: variantDefault,
  outline: variantOutline,
  "outline-monochrome": variantOutlineMonochrome,
  plain: variantPlain,
  "plain-monochrome": variantPlainMonochrome,
  "plain-destructive": variantPlainDestructive,
  primary: variantPrimary,
  destructive: variantDestructive,
}

const sizes: Record<string, SystemStyleObject> = {
  large: {
    minW: "12",
    minH: "11",
    fontSize: "md",
    px: "5",
    py: "3",
  },
  medium: {
    minW: "10",
    minH: "9",
    fontSize: "sm",
    px: "4",
    py: "2",
  },
  slim: {
    minW: "8",
    minH: "7",
    fontSize: "sm",
    px: "3",
    py: "3px",
  },
  micro: {
    minW: "6",
    minH: "5",
    fontSize: "sm",
    px: "2",
    py: "1px",
  },
}

const defaultProps = {
  variant: "default",
  size: "md",
  colorScheme: "gray",
}

export default {
  baseStyle,
  variants,
  sizes,
  defaultProps,
}
