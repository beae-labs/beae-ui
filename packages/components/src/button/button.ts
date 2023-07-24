import { defineComponent, h, ref } from "vue"

export const Button = defineComponent({
  setup(_, { slots }) {
    const link = ref("https://www.google.com")

    return () =>
      h(
        "div",
        {
          class: "beae-wrapper",
        },
        h("a", { href: link.value }, slots.default?.()),
      )
  },
})
