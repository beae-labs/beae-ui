import { type PropType, type DefineComponent, h, defineComponent } from "vue"
import Button from "./button"
import { ButtonOptions } from "./button.utils"
import { Icon } from "@beae-ui/icon"

const IconButtonProps = {
  icon: String as PropType<string>,
  isRound: Boolean as PropType<boolean>,
  ariaLabel: {
    type: String as PropType<string>,
    required: true,
  },
}

export interface IconButtonProps extends ButtonOptions {
  icon: string
  isRound?: boolean
  ariaLabel: string
}

const IconButton: DefineComponent = defineComponent({
  name: "IconButton",
  props: IconButtonProps,
  setup(props, { attrs }) {
    if (!props.ariaLabel) {
      console.error(
        `beae: The \`aria-label\` prop is required for the <l-icon-button />`,
      )
    }

    return () =>
      // @ts-ignore
      h(
        Button,
        {
          padding: "0",
          rounded: props.isRound ? "rounded" : "md",
          ariaLabel: props.ariaLabel,
          ...attrs,
        },
        h(Icon, {
          ariaHidden: props.ariaLabel,
          focusable: 0,
          name: props.icon,
        }),
      )
  },
})

export default IconButton
