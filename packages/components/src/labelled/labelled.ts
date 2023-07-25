import { PropType, defineComponent, h } from "vue"
import { classNames, useFeatures } from "@beae-ui/utils"
// import {buttonFrom} from '../Button';  // TODO: button
import { Label, labelID } from "../label"
import type { LabelProps } from "../label"
import { InlineError } from "../inline-error"
// import { Text } from '../Text'; // TODO: button

const styles = {
  hidden: "labelled-hidden",
  disabled: "labelled-disabled",
  readOnly: "labelled-readonly",
  HelpText: "labelled-HelpText",
  LabelWrapper: "labelled-LabelWrapper",
  Action: "labelled-Action",
  Error: "labelled-Error",
}

export { labelID }

export interface Action {
  /** A unique identifier for the action */
  id?: string
  /** Content the action displays */
  content?: string
  /** Visually hidden text for screen readers */
  accessibilityLabel?: string
  /** A destination to link to, rendered in the action */
  url?: string
  /** Forces url to open in a new tab */
  external?: boolean
  /** Where to display the url */
  target?: Target
  /** Callback when an action takes place */
  onAction?(): void
  /** Callback when mouse enter */
  onMouseEnter?(): void
  /** Callback when element is touched */
  onTouchStart?(): void
}
export type Target = "_blank" | "_self" | "_parent" | "_top"
export type Error = string | HTMLElement | (string | HTMLElement)[]
export interface LabelledProps {
  /** A unique identifier for the label */
  id: LabelProps["id"]
  /** Text for the label */
  //   label: React.ReactNode; use slot
  /** Error to display beneath the label */
  error?: Error | boolean
  /** An action */
  action?: Action
  /** Additional hint text to display */
  //   helpText?: React.ReactNode; use slot
  /** Content to display inside the connected */
  //   children?: React.ReactNode; use slot
  /** Visually hide the label */
  labelHidden?: boolean
  /** Visual required indicator for the label */
  requiredIndicator?: boolean
  /** Labels signify a disabled control */
  disabled?: boolean
  /** Labels signify a readOnly control */
  readOnly?: boolean
}

export const Labelled = defineComponent({
  props: {
    id: String as PropType<LabelledProps["id"]>,
    hidden: Boolean as PropType<LabelledProps["hidden"]>,
    requiredIndicator: Boolean as PropType<LabelledProps["requiredIndicator"]>,
    /** Error to display beneath the label */
    error: Boolean as PropType<LabelledProps["error"]>,
    /** An action */
    action: {} as PropType<LabelledProps["action"]>,
    /** Visually hide the label */
    labelHidden: Boolean as PropType<LabelledProps["labelHidden"]>,
    /** Visual required indicator for the label */
    /** Labels signify a disabled control */
    disabled: Boolean as PropType<LabelledProps["disabled"]>,
    /** Labels signify a readOnly control */
    readOnly: Boolean as PropType<LabelledProps["readOnly"]>,
  },
  setup(props, { slots }) {
    const { polarisSummerEditions2023 } = useFeatures()

    const className = classNames(
      props.labelHidden && styles.hidden,
      props.disabled && styles.disabled,
      polarisSummerEditions2023 && props.readOnly && styles.readOnly,
    )

    const actionMarkup = props.action
      ? h(
          "div",
          { class: styles.Action },
          h("buttonFrom", props.action, "Button"),
        )
      : null

    const helpTextMarkup = slots.helpText?.()
      ? h(
          "div",
          {
            class: styles.HelpText,
            id: helpTextID(props.id),
          },
          h(
            "Text",
            {
              as: "span",
              color: "subdued",
              breakWord: true,
            },
            slots.helpText?.(),
          ),
        )
      : null

    const errorMarkup =
      props.error &&
      typeof props.error !== "boolean" &&
      h(
        "div",
        { class: styles.Error },
        h(InlineError, { message: props.error, fieldID: props.id }),
      )

    const labelMarkup = slots.label?.()
      ? h("div", { class: styles.LabelWrapper }, [
          h(
            Label,
            {
              id: props.id,
              requiredIndicator: props.requiredIndicator,
              hidden: false,
            },
            slots.label?.(),
          ),
          actionMarkup,
        ])
      : null

    return () =>
      h("div", { class: className }, [
        labelMarkup,
        slots.children?.(),
        errorMarkup,
        helpTextMarkup,
      ])
  },
})

export function errorID(id: string) {
  return `${id}Error`
}

export function helpTextID(id: string) {
  return `${id}HelpText`
}
