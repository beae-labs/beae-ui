import { PropType, defineComponent, h } from "vue"
import { useIsAfterInitialMount } from "@beae-ui/hooks"
import { classNames } from "@beae-ui/utils"

type Size = "small" | "large"

export interface SpinnerProps {
  /**
   * Size of spinner
   * @default 'large'
   */
  size?: Size
  /** Accessible label for the spinner */
  accessibilityLabel?: string
  /** Allows the component to apply the correct accessibility roles based on focus */
  hasFocusableParent?: boolean
}

const _spinnerProps = {
  accessibilityLabel: {
    type: String as PropType<SpinnerProps["accessibilityLabel"]>,
    require: false,
  },
  hasFocusableParent: {
    type: Boolean as PropType<SpinnerProps["hasFocusableParent"]>,
    require: false,
  },
  size: {
    type: String as PropType<SpinnerProps["size"]>,
    require: false,
    default: "large",
  },
}

export const Spinner = defineComponent({
  props: _spinnerProps,
  setup(props) {
    const { isAfterInitialMount } = useIsAfterInitialMount()

    const className = classNames(
      "spinner",
      props.size && `spinner-${props.size}`,
    )

    const spinnerSVGMarkup =
      props.size === "large" &&
      h(
        "svg",
        {
          viewBox: "0 0 44 44",
          xmlns: "http://www.w3.org/2000/svg",
        },
        h("path", {
          d: "M15.542 1.487A21.507 21.507 0 00.5 22c0 11.874 9.626 21.5 21.5 21.5 9.847 0 18.364-6.675 20.809-16.072a1.5 1.5 0 00-2.904-.756C37.803 34.755 30.473 40.5 22 40.5 11.783 40.5 3.5 32.217 3.5 22c0-8.137 5.3-15.247 12.942-17.65a1.5 1.5 0 10-.9-2.863z",
        }),
      ) &&
      h(
        "svg",
        {
          viewBox: "0 0 20 20",
          xmlns: "http://www.w3.org/2000/svg",
        },
        h("path", {
          d: "M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z",
        }),
      )

    const spanAttributes = {
      ...(!props.hasFocusableParent && { role: "status" }),
    }

    const accessibilityLabelMarkup =
      (isAfterInitialMount.value || !props.hasFocusableParent) &&
      h("span", {}, props.accessibilityLabel)

    return () => [
      h(
        "span",
        {
          class: className,
        },
        spinnerSVGMarkup,
      ),
      h(
        "span",
        {
          ...spanAttributes,
        },
        accessibilityLabelMarkup,
      ),
    ]
  },
})
