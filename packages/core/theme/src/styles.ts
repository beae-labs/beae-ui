import type { Styles } from "@beae-ui/theme-tools"

export const styles: Styles = {
  global: {
    body: {
      fontFamily: "body",
      color: "beae-body-text",
      bg: "beae-body-bg",
      transitionProperty: "background-color",
      transitionDuration: "normal",
      lineHeight: "base",
    },
    "*::placeholder": {
      color: "beae-placeholder-color",
    },
    "*, *::before, &::after": {
      borderColor: "beae-border-color",
    },
  },
}
