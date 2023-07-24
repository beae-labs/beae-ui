import { defineComponent, h } from "vue"

export const Button = defineComponent({
  setup(_, { slots }) {
    return () => h("button", { type: "button" }, slots.default?.())
  },
})
