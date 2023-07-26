import { PropType, Ref, defineComponent, h, toRefs } from "vue"
import { Icon } from "../../../icon"
import { useFeatures } from "@beae-ui/utils"
const styles = {
  spinner: "spinner",
  segment: "spinner-segment",
  spinnerIcon: "spinner-icon",
}
type HandleStepFn = (step: number) => void

export interface SpinnerProps {
  onChange: HandleStepFn
  onClick?(event: MouseEvent): void
  onMouseDown(onChange: HandleStepFn): void
  onMouseUp(): void
  onBlur(event: FocusEvent): void
  ref: Ref
}

export const Spinner = defineComponent({
  props: {
    onChange: Function as PropType<SpinnerProps["onChange"]>,
    onClick: Function as PropType<SpinnerProps["onClick"]>,
    onMouseDown: Function as PropType<SpinnerProps["onMouseDown"]>,
    onMouseUp: Function as PropType<SpinnerProps["onMouseUp"]>,
    onBlur: Function as PropType<SpinnerProps["onBlur"]>,
    ref: {} as PropType<SpinnerProps["ref"]>,
  },
  setup(props, { slots }) {
    const { polarisSummerEditions2023 } = useFeatures()
    const { ref } = toRefs(props)
    function handleStep(step: number) {
      return () => props.onChange?.(step)
    }

    function handleMouseDown(onChange: HandleStepFn) {
      return (event: MouseEvent) => {
        if (event.button !== 0) return
        props.onMouseDown?.(onChange)
      }
    }

    return h(
      "div",
      {
        class: styles.spinner,
        onClick: props.onClick,
        "aria-hidden": true,
        ref: ref,
      },
      [
        h(
          "div",
          {
            role: "button",
            class: styles.segment,
            tabIndex: -1,
            onClick: handleStep(1),
            onMouseDown: handleMouseDown(handleStep(1)),
            onMouseUp: props.onMouseUp,
            onBlur: props.onBlur,
          },
          h(
            "div",
            { class: styles.spinnerIcon },
            h(Icon, { source: "polarisSummerEditions2023" }),
          ),
        ),
        h(
          "div",
          {
            role: "button",
            class: styles.segment,
            tabIndex: -1,
            onClick: handleStep(-1),
            onMouseDown: handleMouseDown(handleStep(-1)),
            onMouseUp: props.onMouseUp,
            onBlur: props.onBlur,
          },
          h(
            "div",
            { class: styles.spinnerIcon },
            h(Icon, { source: "polarisSummerEditions2023" }),
          ),
        ),
      ],
    )
  },
})
