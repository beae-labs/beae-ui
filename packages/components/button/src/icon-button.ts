import { h, defineComponent, PropType } from "vue"
import Button from "./button"
import { ButtonProps } from "./button.utils"
import { Icon } from "@beae-ui/icon"
import { ComponentWithProps, DeepPartial } from "@beae-ui/system"

const IconButtonProps = {
  icon: String as PropType<string>,
  isRound: Boolean as PropType<boolean>,
  ariaLabel: {
    type: String as PropType<string>,
    required: true,
  },
}

export interface IconButtonProps extends ButtonProps {
  icon: string
  isRound?: boolean
  ariaLabel: string
}

const IconButton: ComponentWithProps<DeepPartial<IconButtonProps>> =
  defineComponent({
    name: "IconButton",
    props: IconButtonProps,
    setup(props, { attrs }) {
      if (!props.ariaLabel) {
        console.error(
          `beae: The \`aria-label\` prop is required for the <l-icon-button />`,
        )
      }

      return () =>
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
