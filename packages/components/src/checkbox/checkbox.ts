import { defineComponent, h, inject, ref, PropType } from "vue"
// import { MinusMinor, TickSmallMinor } from '@shopify/polaris-icons';
// TODO:  WithinListboxContext not export
import { classNames, useFeatures } from "@beae-ui/utils"
import type { ChoiceBleedProps } from "../choice"
import { Choice, helpTextID } from "../choice"
import { errorTextID } from "../inline-error"
import { Icon } from "../Icon" // TODO: sử dụng icon
import type { Error, CheckboxHandles } from "../../types"
import { useId } from "./use-checkbox"
const styles = {
  checked: "checkbox-checked",
  Input: "checkbox-input",
  "Input-indeterminate": "checkbox-input-indeterminate",
  ChoiceLabel: "checkbox-choiceLabel",
  Backdrop: "checkbox-backdrop",
  Icon: "checkbox-icon",
  animated: "checkbox-animated",
}
export interface CheckboxProps extends ChoiceBleedProps {
  /** Indicates the ID of the element that is controlled by the checkbox */
  ariaControls?: string
  /** Indicates the ID of the element that describes the checkbox */
  ariaDescribedBy?: string
  /** Label for the checkbox */
  label?: string
  /** Visually hide the label */
  labelHidden?: boolean
  /** Checkbox is selected. `indeterminate` shows a horizontal line in the checkbox */
  checked?: boolean | "indeterminate"
  /** Disable input */
  disabled?: boolean
  /** ID for form input */
  id?: string
  /** Name for form input */
  name?: string
  /** Value for form input */
  value?: string
  /** Callback when checkbox is toggled */
  onChange?(newChecked: boolean, id: string): void
  /** Callback when checkbox is focused */
  onFocus?(): void
  /** Callback when focus is removed */
  onBlur?(): void
  /** Added to the wrapping label */
  labelClassName?: string
  /** Grow to fill the space. Equivalent to width: 100%; height: 100% */
  fill?: boolean
  /** Additional text to aide in use */
  //   helpText?: React.ReactNode; use slot helpText
  /** Display an error message */
  error?: Error | boolean
}

export const Checkbox = defineComponent({
  props: {
    /** Indicates the ID of the element that is controlled by the checkbox */
    ariaControls: String as PropType<CheckboxProps["ariaControls"]>,
    /** Indicates the ID of the element that describes the checkbox */
    ariaDescribedBy: String as PropType<CheckboxProps["ariaDescribedBy"]>,
    /** Label for the checkbox */
    label: String as PropType<CheckboxProps["label"]>,
    /** Visually hide the label */
    labelHidden: Boolean as PropType<CheckboxProps["labelHidden"]>,
    /** Checkbox is selected. `indeterminate` shows a horizontal line in the checkbox */
    checked: Boolean as PropType<CheckboxProps["checked"]>,
    /** Disable input */
    disabled: Boolean as PropType<CheckboxProps["disabled"]>,
    /** ID for form input */
    id: [String, Number] as PropType<CheckboxProps["id"]>,
    /** Name for form input */
    name: String as PropType<CheckboxProps["name"]>,
    /** Value for form input */
    value: String as PropType<CheckboxProps["value"]>,
    /** Callback when checkbox is toggled */
    onChange: Function as PropType<CheckboxProps["onChange"]>,
    /** Callback when checkbox is focused */
    onFocus: Function as PropType<CheckboxProps["onFocus"]>,
    /** Callback when focus is removed */
    onBlur: Function as PropType<CheckboxProps["onBlur"]>,
    /** Added to the wrapping label */
    labelClassName: String as PropType<CheckboxProps["labelClassName"]>,
    /** Grow to fill the space. Equivalent to width: 100%; height: 100% */
    fill: Boolean as PropType<CheckboxProps["fill"]>,
    /** Additional text to aide in use */
    //   helpText?: React.ReactNode; use slot helpText
    /** Display an error message */
    error: Boolean as PropType<CheckboxProps["error"]>,
    bleed: Number as PropType<CheckboxProps["bleed"]>,
    bleedBlockStart: Number as PropType<CheckboxProps["bleedBlockStart"]>,
    bleedBlockEnd: Number as PropType<CheckboxProps["bleedBlockEnd"]>,
    bleedInlineStart: Number as PropType<CheckboxProps["bleedInlineStart"]>,
    bleedInlineEnd: Number as PropType<CheckboxProps["bleedInlineEnd"]>,
  },
  setup(props, { slots, expose }) {
    const inputNode = ref<HTMLInputElement | null>(null)
    const uniqId = useId()
    const id = props?.id ?? uniqId
    // const isWithinListbox = inject(WithinListboxContext);
    // const { polarisSummerEditions2023 } = useFeatures();
    const isWithinListbox = false
    const polarisSummerEditions2023 = ""
    // Function to focus the input
    const focusInput = () => {
      if (inputNode.value) {
        inputNode.value.focus()
      }
    }

    // Call defineExpose to expose the focusInput function to the parent component
    expose({
      focusInput,
    })

    const handleBlur = () => {
      props?.onBlur && props?.onBlur()
    }

    const handleOnClick = () => {
      if (
        props?.onChange == null ||
        inputNode.value == null ||
        props?.disabled
      ) {
        return
      }

      props?.onChange(inputNode.value.checked, props?.id)
      inputNode.value.focus()
    }

    const describedBy: string[] = []
    if (props?.error && typeof props?.error !== "boolean") {
      describedBy.push(errorTextID(props?.id))
    }
    if (slots.helpText) {
      describedBy.push(helpTextID(props?.id))
    }
    const ariaDescribedByProp = props?.ariaDescribedBy
    if (ariaDescribedByProp) {
      describedBy.push(ariaDescribedByProp)
    }
    const ariaDescribedBy = describedBy.length
      ? describedBy.join(" ")
      : undefined

    const wrapperClassName = classNames(
      "checkbox",
      props?.error && "checkbox-error",
    )

    const isIndeterminate = props?.checked === "indeterminate"
    const isChecked = !isIndeterminate && Boolean(props?.checked)

    const indeterminateAttributes = isIndeterminate
      ? { indeterminate: "true", "aria-checked": "mixed" as const }
      : { "aria-checked": isChecked }
    // TODO: chuyển sang remixicon
    // const iconSource = isIndeterminate ? MinusMinor : TickSmallMinor;
    const iconSource = "icon"

    const animatedTickIcon = polarisSummerEditions2023 && !isIndeterminate

    const iconSourceSe23 = h(
      "svg",
      {
        viewBox: "0 0 16 16",
        shapeRendering: "geometricPrecision",
        textRendering: "geometricPrecision",
      },
      h("path", {
        className: classNames(props?.checked && styles?.checked),
        d: "M1.5,5.5L3.44655,8.22517C3.72862,8.62007,4.30578,8.64717,4.62362,8.28044L10.5,1.5",
        transform: "translate(2 2.980376)",
        opacity: "0",
        fill: "none",
        stroke: "#fff",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        pathLength: "1",
      }),
    )

    const inputClassName = classNames(
      styles?.Input,
      isIndeterminate && styles["Input-indeterminate"],
    )

    const extraChoiceProps = {
      error: props?.error,
      bleed: props?.bleed,
      bleedBlockStart: props?.bleedBlockStart,
      bleedBlockEnd: props?.bleedBlockEnd,
      bleedInlineStart: props?.bleedInlineStart,
      bleedInlineEnd: props?.bleedInlineEnd,
    }
    return () =>
      h(
        Choice,
        {
          id: id,
          labelHidden: props?.labelHidden,
          disabled: props?.disabled,
          labelClassName: classNames(
            styles?.ChoiceLabel,
            props?.labelClassName,
          ),
          fill: props?.fill,
          label: props?.label,
          ...extraChoiceProps,
        },
        {
          label: slots.label?.(),
          helpText: slots.helpText?.(),
          children: () =>
            h(
              "span",
              {
                class: wrapperClassName,
              },
              [
                h("input", {
                  ref: inputNode,
                  id: id,
                  name: props?.name,
                  value: props?.value,
                  type: "checkbox",
                  checked: isChecked,
                  disabled: props?.disabled,
                  className: inputClassName,
                  onBlur: handleBlur,
                  onChange: noop,
                  onClick: handleOnClick,
                  onFocus: props?.onFocus,
                  ariaInvalid: props?.error != null,
                  ariaControls: props?.ariaControls,
                  ariaDescribedby: ariaDescribedBy,
                  role: isWithinListbox ? "presentation" : "checkbox",
                  ...indeterminateAttributes,
                }),
                h("span", {
                  class: styles?.Backdrop,
                  onClick: stopPropagation,
                  onKeyUp: stopPropagation,
                }),
                h(
                  "span",
                  {
                    class: classNames(
                      styles?.Icon,
                      animatedTickIcon && styles?.animated,
                    ),
                  },
                  animatedTickIcon
                    ? iconSourceSe23
                    : h("Icon", { source: iconSource }),
                ),
              ],
            ),
        },
      )
  },
})
function noop() {}
function stopPropagation(event) {
  event.stopPropagation()
}
