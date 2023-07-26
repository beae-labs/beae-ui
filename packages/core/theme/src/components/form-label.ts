import type { SystemStyleObject } from "@beae-ui/theme-tools"

const baseStyle: SystemStyleObject = {
  fontSize: "md",
  marginEnd: 3,
  mb: 2,
  fontWeight: "medium",
  transitionProperty: "common",
  transitionDuration: "normal",
  opacity: 1,
  _disabled: {
    opacity: 0.4,
  },
}

export default {
  baseStyle,
}