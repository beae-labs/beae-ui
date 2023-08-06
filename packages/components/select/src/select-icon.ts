import { beae } from "@beae-ui/system"
import { defineComponent, h } from "vue"

export const DefaultSelectIcon = defineComponent(() => {
  return () =>
    h(
      beae.svg,
      {
        __label: "select__icon",
        role: "presentation",
        viewBox: "0 0 24 24",
        "aria-hidden": "true",
        style: {
          width: "1em",
          height: "1em",
          color: "currentcolor",
        },
      },
      h(beae.path, {
        d: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z",
        fill: "currentcolor",
      }),
    )
})

export const SelectIcon = defineComponent({
  name: "SelectIcon",
  setup(_, { attrs, slots }) {
    return () =>
      h(
        beae.div,
        {
          __label: "select__icon-wrapper",
          position: "absolute",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          top: "50%",
          transform: "translateY(-50%)",
          ...attrs,
        },
        slots.default?.(),
      )
  },
})
