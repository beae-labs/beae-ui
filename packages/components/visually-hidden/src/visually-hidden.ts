import { h, defineComponent } from "vue"
import { beae } from "@beae-ui/system"
import { CSSObject } from "@emotion/css"

export const visuallyHiddenStyle: CSSObject = {
  border: "0px",
  clip: "rect(0px, 0px, 0px, 0px)",
  height: "1px",
  width: "1px",
  margin: "-1px",
  padding: "0px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  position: "absolute",
}

export const VisuallyHidden = defineComponent({
  setup(_, { attrs }) {
    return () => {
      return h(
        beae(beae("span"), {
          label: "visually-hidden",
        }),
        {
          __css: visuallyHiddenStyle,
          ...attrs,
        },
      )
    }
  },
})

export const VisuallyHiddenInput = defineComponent({
  setup(_, { attrs }) {
    return () => {
      return h(
        beae(beae("input"), {
          label: "visually-hidden",
        }),
        {
          __css: visuallyHiddenStyle,
          ...attrs,
        },
      )
    }
  },
})

export default VisuallyHidden
