import { defineComponent, h, ref } from "vue"
import { ButtonProps } from "./button.types"
import { classNames } from "@beae-ui/utils"

// interface CommonButtonProps
//   extends Pick<
//     ButtonProps,
//     | "id"
//     | "accessibilityLabel"
//     | "ariaDescribedBy"
//     | "role"
//     | "onClick"
//     | "onFocus"
//     | "onBlur"
//     | "onMouseEnter"
//     | "onTouchStart"
//   > {
//   className: UnstyledButtonProps["className"]
//   onMouseUp: MouseUpBlurHandler
//   "data-primary-link"?: boolean
// }

type LinkButtonProps = Pick<
  ButtonProps,
  "url" | "external" | "download" | "target"
>

type ActionButtonProps = Pick<
  ButtonProps,
  | "submit"
  | "disabled"
  | "loading"
  | "ariaControls"
  | "ariaExpanded"
  | "ariaChecked"
  | "pressed"
  | "onKeyDown"
  | "onKeyUp"
  | "onKeyPress"
  | "onPointerDown"
>

const DEFAULT_SIZE = "medium"

export const Button = defineComponent<ButtonProps>({
  setup(props, { slots }) {
    const { disabled, loading, size = DEFAULT_SIZE, primary } = props
    const isDisabled = disabled || loading

    const className = classNames("button", primary && "button-primary")

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
