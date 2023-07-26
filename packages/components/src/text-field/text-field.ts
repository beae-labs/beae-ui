import {
  classNames,
  variationName,
  useI18n,
  useIsAfterInitialMount,
  useEventListener,
} from "@beae-ui/utils"
import { Labelled, helpTextID, labelID } from "../labelled"
import type { LabelledProps } from "../labelled"
import { Connected } from "../connected"
import { Icon } from "../icon"
import { Text } from "../text"
import { PropType, defineComponent, h, ref, watch } from "vue"

import { Resizer, Spinner } from "./components"
import type { SpinnerProps } from "./components"

import { useId } from "./use-text-field"

const styles = {
  textField: "text-field",
  hasValue: "text-field-has-value",
  disabled: "text-field-disabled",
  readOnly: "text-field-read-only",
  error: "text-field-error",
  multiline: "text-field-multiline",
  focus: "text-field-focus",
  borderless: "text-field-borderless",
  prefix: "text-field-prefix",
  suffix: "text-field-suffix",
  characterCount: "text-field-character-count",
  alignFieldBottom: "text-field-align-field-bottom",
  clearButton: "text-field-button-clear",
  input: "text-field-input",
  inputSuffixed: "text-field-input-suffixed",
  inputHasClearButton: "text-field-input-has-clear-button",
  monospaced: "text-field-monospaced",
  suggestion: "text-field-suggestion",
  verticalContent: "text-field-vertical-content",
  backdrop: "text-field-backdrop",
  backdropConnectedLeft: "text-field-backdrop-connected-left",
  backdropConnectedRight: "text-field-backdrop-connected-right",
}
export enum Key {
  Backspace = 8,
  Tab = 9,
  Enter = 13,
  Shift = 16,
  Ctrl = 17,
  Alt = 18,
  Pause = 19,
  CapsLock = 20,
  Escape = 27,
  Space = 32,
  PageUp = 33,
  PageDown = 34,
  End = 35,
  Home = 36,
  LeftArrow = 37,
  UpArrow = 38,
  RightArrow = 39,
  DownArrow = 40,
  Insert = 45,
  Delete = 46,
  Key0 = 48,
  Key1 = 49,
  Key2 = 50,
  Key3 = 51,
  Key4 = 52,
  Key5 = 53,
  Key6 = 54,
  Key7 = 55,
  Key8 = 56,
  Key9 = 57,
  KeyA = 65,
  KeyB = 66,
  KeyC = 67,
  KeyD = 68,
  KeyE = 69,
  KeyF = 70,
  KeyG = 71,
  KeyH = 72,
  KeyI = 73,
  KeyJ = 74,
  KeyK = 75,
  KeyL = 76,
  KeyM = 77,
  KeyN = 78,
  KeyO = 79,
  KeyP = 80,
  KeyQ = 81,
  KeyR = 82,
  KeyS = 83,
  KeyT = 84,
  KeyU = 85,
  KeyV = 86,
  KeyW = 87,
  KeyX = 88,
  KeyY = 89,
  KeyZ = 90,
  LeftMeta = 91,
  RightMeta = 92,
  Select = 93,
  Numpad0 = 96,
  Numpad1 = 97,
  Numpad2 = 98,
  Numpad3 = 99,
  Numpad4 = 100,
  Numpad5 = 101,
  Numpad6 = 102,
  Numpad7 = 103,
  Numpad8 = 104,
  Numpad9 = 105,
  Multiply = 106,
  Add = 107,
  Subtract = 109,
  Decimal = 110,
  Divide = 111,
  F1 = 112,
  F2 = 113,
  F3 = 114,
  F4 = 115,
  F5 = 116,
  F6 = 117,
  F7 = 118,
  F8 = 119,
  F9 = 120,
  F10 = 121,
  F11 = 122,
  F12 = 123,
  NumLock = 144,
  ScrollLock = 145,
  Semicolon = 186,
  Equals = 187,
  Comma = 188,
  Dash = 189,
  Period = 190,
  ForwardSlash = 191,
  GraveAccent = 192,
  OpenBracket = 219,
  BackSlash = 220,
  CloseBracket = 221,
  SingleQuote = 222,
}
export type Error = string | HTMLElement | (string | HTMLElement)[]
type Type =
  | "text"
  | "email"
  | "number"
  | "integer"
  | "password"
  | "search"
  | "tel"
  | "url"
  | "date"
  | "datetime-local"
  | "month"
  | "time"
  | "week"
  | "currency"

type Alignment = "left" | "center" | "right"

type InputMode =
  | "none"
  | "text"
  | "decimal"
  | "numeric"
  | "tel"
  | "search"
  | "email"
  | "url"

interface SelectSuggestion {
  suggestion?: string
}

interface SelectTextOnFocus {
  selectTextOnFocus?: true
}

interface Readonly {
  readonly?: true
}

interface Disabled {
  disabled?: true
}

interface Interactive {
  onChange(value: string, id: string): void
}

interface NonMutuallyExclusiveProps {
  /** Text to display before value */
  // prefix?: React.ReactNode; use slot
  /** Text to display after value */
  // suffix?: React.ReactNode; use slot
  /** Content to vertically display above the input value */
  // verticalContent?: React.ReactNode; use slot
  /** Hint text to display */
  placeholder?: string
  /** Initial value for the input */
  value?: string
  /** Additional hint text to display */
  // helpText?: React.ReactNode; use slot
  /** Label for the input */
  // label: React.ReactNode; use slot
  /** Adds an action to the label */
  labelAction?: LabelledProps["action"]
  /** Visually hide the label */
  labelHidden?: boolean
  /** Disable the input */
  disabled?: boolean
  /** Show a clear text button in the input */
  clearButton?: boolean
  /** Indicates whether or not the entire value should be selected on focus. */
  selectTextOnFocus?: boolean
  /** An inline autocomplete suggestion containing the input value. The characters that complete the input value are selected for ease of deletion on input change or keypress of Backspace/Delete. The selected substring is visually highlighted with subdued styling. */
  suggestion?: string
  /** Disable editing of the input */
  readOnly?: boolean
  /** Automatically focus the input */
  autoFocus?: boolean
  /** Force the focus state on the input */
  focused?: boolean
  /** Allow for multiple lines of input */
  multiline?: boolean | number
  /** Error to display beneath the label */
  error?: Error | boolean
  /** An element connected to the right of the input */
  // connectedRight?: React.ReactNode; use slot
  /** An element connected to the left of the input */
  // connectedLeft?: React.ReactNode;  use slot
  /** Determine type of input */
  type?: Type
  /** Name of the input */
  name?: string
  /** ID for the input */
  id?: string
  /** Defines a specific role attribute for the input */
  role?: string
  /** Limit increment value for numeric and date-time inputs */
  step?: number
  /** Increment value for numeric and date-time inputs when using Page Up or Page Down */
  largeStep?: number
  /** Enable automatic completion by the browser. Set to "off" when you do not want the browser to fill in info */
  autoComplete: string
  /** Mimics the behavior of the native HTML attribute, limiting the maximum value */
  max?: number | string
  /** Maximum character length for an input */
  maxLength?: number
  /** Maximum height of the input element. Only applies when `multiline` is `true` */
  maxHeight?: number | string
  /** Mimics the behavior of the native HTML attribute, limiting the minimum value */
  min?: number | string
  /** Minimum character length for an input */
  minLength?: number
  /** A regular expression to check the value against */
  pattern?: string
  /** Choose the keyboard that should be used on mobile devices */
  inputMode?: InputMode
  /** Indicate whether value should have spelling checked */
  spellCheck?: boolean
  /** Indicates the id of a component owned by the input */
  ariaOwns?: string
  /** Indicates whether or not a Popover is displayed */
  ariaExpanded?: boolean
  /** Indicates the id of a component controlled by the input */
  ariaControls?: string
  /** Indicates the id of a related component’s visually focused element to the input */
  ariaActiveDescendant?: string
  /** Indicates what kind of user input completion suggestions are provided */
  ariaAutocomplete?: string
  /** Indicates whether or not the character count should be displayed */
  showCharacterCount?: boolean
  /** Determines the alignment of the text in the input */
  align?: Alignment
  /** Visual required indicator, adds an asterisk to label */
  requiredIndicator?: boolean
  /** Indicates whether or not a monospaced font should be used */
  monospaced?: boolean
  /** Callback fired when clear button is clicked */
  onClearButtonClick?(id: string): void
  /** Callback fired when value is changed */
  onChange?(value: string, id: string): void
  /** When provided, callback fired instead of onChange when value is changed via the number step control  */
  onSpinnerChange?(value: string, id: string): void
  /** Callback fired when input is focused */
  onFocus?: (event?: Event) => void
  /** Callback fired when input is blurred */
  onBlur?(event?: Event): void
  /** Removes the border around the input. Used in the IndexFilters component. */
  borderless?: boolean
}

export type MutuallyExclusiveSelectionProps =
  | SelectSuggestion
  | SelectTextOnFocus

export type MutuallyExclusiveInteractionProps =
  | Interactive
  | Readonly
  | Disabled

export type TextFieldProps = NonMutuallyExclusiveProps &
  MutuallyExclusiveInteractionProps &
  MutuallyExclusiveSelectionProps

export const TextField = defineComponent({
  props: {
    placeholder: String as PropType<NonMutuallyExclusiveProps["placeholder"]>,
    value: String as PropType<NonMutuallyExclusiveProps["value"]>,
    labelAction: {} as PropType<NonMutuallyExclusiveProps["labelAction"]>,
    labelHidden: Boolean as PropType<NonMutuallyExclusiveProps["labelHidden"]>,
    disabled: Boolean as PropType<NonMutuallyExclusiveProps["disabled"]>,
    clearButton: Boolean as PropType<NonMutuallyExclusiveProps["clearButton"]>,
    readOnly: Boolean as PropType<NonMutuallyExclusiveProps["readOnly"]>,
    autoFocus: Boolean as PropType<NonMutuallyExclusiveProps["autoFocus"]>,
    focused: Boolean as PropType<NonMutuallyExclusiveProps["focused"]>,
    multiline: [Boolean, Number] as PropType<
      NonMutuallyExclusiveProps["multiline"]
    >,
    error: [Error, Boolean] as PropType<NonMutuallyExclusiveProps["error"]>,
    type: String as PropType<NonMutuallyExclusiveProps["type"]>,
    name: String as PropType<NonMutuallyExclusiveProps["name"]>,
    id: String as PropType<NonMutuallyExclusiveProps["id"]>,
    role: String as PropType<NonMutuallyExclusiveProps["role"]>,
    step: Number as PropType<NonMutuallyExclusiveProps["step"]>,
    largeStep: Number as PropType<NonMutuallyExclusiveProps["largeStep"]>,
    autoComplete: String as PropType<NonMutuallyExclusiveProps["autoComplete"]>,
    max: [Number, String] as PropType<NonMutuallyExclusiveProps["max"]>,
    maxLength: Number as PropType<NonMutuallyExclusiveProps["maxLength"]>,
    maxHeight: [Number, String] as PropType<
      NonMutuallyExclusiveProps["maxHeight"]
    >,
    min: [Number, String] as PropType<NonMutuallyExclusiveProps["min"]>,
    minLength: Number as PropType<NonMutuallyExclusiveProps["minLength"]>,
    pattern: String as PropType<NonMutuallyExclusiveProps["pattern"]>,
    inputMode: String as PropType<NonMutuallyExclusiveProps["inputMode"]>,
    spellCheck: Boolean as PropType<NonMutuallyExclusiveProps["spellCheck"]>,
    ariaOwns: String as PropType<NonMutuallyExclusiveProps["ariaOwns"]>,
    ariaControls: String as PropType<NonMutuallyExclusiveProps["ariaControls"]>,
    ariaExpanded: Boolean as PropType<
      NonMutuallyExclusiveProps["ariaExpanded"]
    >,
    ariaActiveDescendant: String as PropType<
      NonMutuallyExclusiveProps["ariaActiveDescendant"]
    >,
    ariaAutocomplete: String as PropType<
      NonMutuallyExclusiveProps["ariaAutocomplete"]
    >,
    showCharacterCount: Boolean as PropType<
      NonMutuallyExclusiveProps["showCharacterCount"]
    >,
    align: String as PropType<NonMutuallyExclusiveProps["align"]>,
    requiredIndicator: Boolean as PropType<
      NonMutuallyExclusiveProps["requiredIndicator"]
    >,
    monospaced: Boolean as PropType<NonMutuallyExclusiveProps["monospaced"]>,
    selectTextOnFocus: Boolean as PropType<
      NonMutuallyExclusiveProps["selectTextOnFocus"]
    >,
    suggestion: String as PropType<NonMutuallyExclusiveProps["suggestion"]>,
    onClearButtonClick: Function as PropType<
      NonMutuallyExclusiveProps["onClearButtonClick"]
    >,
    onChange: Function as PropType<NonMutuallyExclusiveProps["onChange"]>,
    onSpinnerChange: Function as PropType<
      NonMutuallyExclusiveProps["onSpinnerChange"]
    >,
    onFocus: Function as PropType<NonMutuallyExclusiveProps["onFocus"]>,
    onBlur: Function as PropType<NonMutuallyExclusiveProps["onBlur"]>,
    borderless: Boolean as PropType<NonMutuallyExclusiveProps["borderless"]>,
  },
  setup(props, { slots }) {
    const i18n = useI18n()
    const height = ref<number | null>(null)
    const focus = ref(Boolean(props.focused))
    const isAfterInitial = useIsAfterInitialMount()
    const uniqId = useId<String>()
    const id = String(props.id ?? uniqId)

    const inputRef = ref<HTMLInputElement | null>(null)
    const textAreaRef = ref<HTMLTextAreaElement | null>(null)
    const prefixRef = ref<HTMLDivElement | null>(null)
    const suffixRef = ref<HTMLDivElement | null>(null)
    const verticalContentRef = ref<HTMLDivElement | null>(null)
    const buttonPressTimer = ref<number>()
    const spinnerRef = ref<HTMLDivElement | null>(null)

    watch(
      () => [props.focused, props.multiline],
      ([focusedValue, multilineValue]: (Number | Boolean | undefined)[]) => {
        const input = multilineValue ? textAreaRef.value : inputRef.value
        if (!input || focusedValue === undefined) return
        focusedValue ? input.focus() : input.blur()
      },
    )

    watch(
      () => [focus.value, props.value, props.type, props.suggestion],
      ([focusValue, valueValue, typeValue, suggestionValue]: (
        | string
        | boolean
        | undefined
      )[]) => {
        const input = inputRef.value
        const isSupportedInputType =
          typeValue === "text" ||
          typeValue === "tel" ||
          typeValue === "search" ||
          typeValue === "url" ||
          typeValue === "password"

        if (!input || !isSupportedInputType || !suggestionValue) {
          return
        }
        if (
          typeof valueValue == "string" &&
          typeof suggestionValue == "string"
        ) {
          input.setSelectionRange(valueValue.length, suggestionValue.length)
        }
      },
    )

    const normalizedValue = props.suggestion ?? props.value
    const normalizedStep = props.step != null ? props.step : 1
    const normalizedMax = props.max != null ? props.max : Infinity
    const normalizedMin = props.min != null ? props.min : -Infinity

    const className = classNames(
      styles.textField,
      Boolean(normalizedValue) && styles.hasValue,
      props.disabled && styles.disabled,
      props.readOnly && styles.readOnly,
      props.error && styles.error,
      props.multiline && styles.multiline,
      focus && !props.disabled && styles.focus,
      props.borderless && styles.borderless,
    )

    const inputType = props.type === "currency" ? "text" : props.type
    const isNumericType = props.type === "number" || props.type === "integer"

    const prefixMarkup = slots.prefix?.()
      ? h(
          "div",
          {
            class: styles.prefix,
            id: id + "-prefix",
            ref: prefixRef,
          },
          slots.prefix?.(),
        )
      : null

    const suffixMarkup = slots.suffix?.()
      ? h(
          "div",
          {
            class: styles.suffix,
            id: id + "-suffix",
            ref: suffixRef,
          },
          slots.suffix?.(),
        )
      : null

    let characterCountMarkup = null
    if (props.showCharacterCount) {
      const characterCount = normalizedValue?.length
      const characterCountLabel = props.maxLength
        ? i18n.translate("Polaris.TextField.characterCountWithMaxLength", {
            count: characterCount,
            limit: props.maxLength,
          })
        : i18n.translate("Polaris.TextField.characterCount", {
            count: characterCount,
          })

      const characterCountClassName = classNames(
        styles.characterCount,
        props.multiline && styles.alignFieldBottom,
      )

      const characterCountText = !props.maxLength
        ? characterCount
        : `${characterCount}/${props.maxLength}`

      characterCountMarkup = h(
        "div",
        {
          id: `${id}-CharacterCounter`,
          class: characterCountClassName,
          "aria-label": characterCountLabel,
          "aria-live": focus ? "polite" : "off",
          "aria-atomic": "true",
          onClick: handleClickChild,
        },
        characterCountText,
      )
    }

    const clearButtonVisible = normalizedValue !== ""

    const clearButtonMarkup =
      props.clearButton && clearButtonVisible
        ? h(
            "button",
            {
              type: "button",
              class: styles.clearButton,
              onClick: handleClearButtonPress,
              disabled: props.disabled,
            },
            [
              h(
                Text,
                { as: "span", visuallyHidden: true },
                i18n.translate("Polaris.Common.clear"),
              ),
              h(Icon, { source: "CircleCancelMinor", color: "base" }),
            ],
          )
        : null

    const handleNumberChange = (steps: number, stepAmount = normalizedStep) => {
      if (props.onChange == null && props.onSpinnerChange == null) {
        return
      }
      // Returns the length of decimal places in a number
      const dpl = (num: number) => (num.toString().split(".")[1] || []).length

      const numericValue = props.value ? parseFloat(props.value) : 0
      if (isNaN(numericValue)) {
        return
      }

      // Making sure the new value has the same length of decimal places as the
      // step / value has.
      const decimalPlaces =
        props.type === "integer"
          ? 0
          : Math.max(dpl(numericValue), dpl(stepAmount))

      const newValue = Math.min(
        Number(normalizedMax),
        Math.max(numericValue + steps * stepAmount, Number(normalizedMin)),
      )

      if (props.onSpinnerChange != null) {
        props.onSpinnerChange(String(newValue.toFixed(decimalPlaces)), id)
      } else if (props.onChange != null) {
        props.onChange(String(newValue.toFixed(decimalPlaces)), id)
      }
    }

    const handleButtonRelease = () => {
      clearTimeout(buttonPressTimer.value)
    }

    const handleButtonPress: SpinnerProps["onMouseDown"] = (onChange) => {
      const minInterval = 50
      const decrementBy = 10
      let interval = 200

      const onChangeInterval = () => {
        if (interval > minInterval) interval -= decrementBy
        onChange(0)
        buttonPressTimer.value = window.setTimeout(onChangeInterval, interval)
      }

      buttonPressTimer.value = window.setTimeout(onChangeInterval, interval)

      document.addEventListener("mouseup", handleButtonRelease, {
        once: true,
      })
    }

    const spinnerMarkup =
      isNumericType && props.step !== 0 && !props.disabled && !props.readOnly
        ? h(Spinner, {
            onClick: handleClickChild,
            onChange: handleNumberChange,
            onMouseDown: handleButtonPress,
            onMouseUp: handleButtonRelease,
            ref: spinnerRef,
            onBlur: handleOnBlur,
          })
        : null

    const style =
      props.multiline && height ? { height, maxHeight: props.maxHeight } : null

    const handleExpandingResize = (payload: number) => {
      height.value = payload
    }

    const resizer =
      props.multiline && isAfterInitial
        ? h(Resizer, {
            contents: normalizedValue || props.placeholder,
            currentHeight: height,
            minimumLines:
              typeof props.multiline === "number" ? props.multiline : 1,
            onHeightChange: handleExpandingResize,
          })
        : null

    const describedBy: string[] = []
    if (props.error) {
      describedBy.push(`${id}Error`)
    }
    if (slots.helpText?.()) {
      describedBy.push(helpTextID(id))
    }
    if (props.showCharacterCount) {
      describedBy.push(`${id}-CharacterCounter`)
    }

    const labelledBy: string[] = []

    if (slots.prefix?.()) {
      labelledBy.push(`${id}-Prefix`)
    }

    if (slots.suffix?.()) {
      labelledBy.push(`${id}-Suffix`)
    }

    if (slots.verticalContent?.()) {
      labelledBy.push(`${id}-VerticalContent`)
    }

    labelledBy.unshift(labelID(id))

    const inputClassName = classNames(
      styles.input,
      props.align && variationName("Input-align", props.align),
      slots.suffix?.() && styles.inputSuffixed,
      props.clearButton && styles.inputHasClearButton,
      props.monospaced && styles.monospaced,
      props.suggestion && styles.suggestion,
    )

    const handleOnFocus = (event: FocusEvent | MouseEvent) => {
      focus.value = true

      if (props.selectTextOnFocus && !props.suggestion) {
        const input = props.multiline ? textAreaRef.value : inputRef.value
        input?.select()
      }

      if (props.onFocus) {
        props.onFocus(event as FocusEvent)
      }
    }

    useEventListener("wheel", handleOnWheel, inputRef)

    function handleOnWheel(event: WheelEvent) {
      if (document.activeElement === event.target && isNumericType) {
        event.stopPropagation()
      }
    }

    const input = h(props.multiline ? "textarea" : "input", {
      name: props.name,
      id,
      disabled: props.disabled,
      readOnly: props.readOnly,
      role: props.role,
      autoFocus: props.autoFocus,
      value: normalizedValue,
      placeholder: props.placeholder,
      style,
      autoComplete: props.autoComplete,
      className: inputClassName,
      ref: props.multiline ? textAreaRef : inputRef,
      min: props.min,
      max: props.max,
      step: props.step,
      minLength: props.minLength,
      maxLength: props.maxLength,
      spellCheck: props.spellCheck,
      pattern: props.pattern,
      inputMode: props.inputMode,
      type: inputType,
      rows: getRows(props.multiline),
      "aria-describedby": describedBy.length
        ? describedBy.join(" ")
        : undefined,
      "aria-labelledby": labelledBy.join(" "),
      "aria-invalid": Boolean(props.error),
      "aria-owns": props.ariaOwns,
      "aria-activedescendant": props.ariaActiveDescendant,
      "aria-autocomplete": props.ariaAutocomplete,
      "aria-controls": props.ariaControls,
      "aria-expanded": props.ariaExpanded,
      "aria-required": props.requiredIndicator,
      ...normalizeAriaMultiline(props.multiline),
      onFocus: handleOnFocus,
      onBlur: handleOnBlur,
      onClick: handleClickChild,
      onKeyPress: handleKeyPress,
      onKeyDown: handleKeyDown,
      onChange: !props.suggestion ? handleChange : undefined,
      onInput: props.suggestion ? handleChange : undefined,
    })

    const inputWithVerticalContentMarkup = slots.verticalContent?.()
      ? h(
          "div",
          {
            className: styles.verticalContent,
            id: `${id}-verticalContent`,
            ref: verticalContentRef,
            onClick: handleClickChild,
          },
          [slots.verticalContent?.(), input],
        )
      : null

    const inputMarkup = slots.verticalContent?.()
      ? inputWithVerticalContentMarkup
      : input

    const backdropMarkup = h("div", {
      class: classNames(
        styles.backdrop,
        slots.connectedLeft?.() && styles.backdropConnectedLeft,
        slots?.connectedRight?.() && styles.backdropConnectedRight,
      ),
    })

    return h(
      Labelled,
      {
        label: slots.label?.(),
        id,
        error: props.error,
        action: props.labelAction,
        labelHidden: props.labelHidden,
        helpText: slots.helpText?.(),
        requiredIndicator: props.requiredIndicator,
        disabled: props.disabled,
        readOnly: props.readOnly,
      },
      h(
        Connected,
        {
          left: slots.connectedLeft?.(),
          right: slots.connectedRight?.(),
        },
        h(
          "div",
          {
            class: className,
            onClick: handleClick,
          },
          [
            prefixMarkup,
            inputMarkup,
            suffixMarkup,
            characterCountMarkup,
            clearButtonMarkup,
            spinnerMarkup,
            backdropMarkup,
            resizer,
          ],
        ),
      ),
    )

    function handleChange(event: InputEvent) {
      props.onChange && props.onChange(event?.currentTarget?.value, id)
    }

    function handleClick(event: MouseEvent) {
      const { target }: any = event

      // For TextFields used with Combobox, focus needs to be set again even
      // if the TextField is already focused to trigger the logic to open the
      // Combobox activator
      const inputRefRole = inputRef?.value?.getAttribute("role")
      if (target === inputRef.value && inputRefRole === "combobox") {
        inputRef.value?.focus()
        handleOnFocus(event)
        return
      }

      if (
        isPrefixOrSuffix(target) ||
        isVerticalContent(target) ||
        isInput(target) ||
        isSpinner(target) ||
        focus
      ) {
        return
      }

      inputRef.value?.focus()
    }

    function handleClickChild(event: [MouseEvent | null]) {
      if (!isSpinner(event.target) && !isInput(event.target)) {
        event.stopPropagation()
      }

      if (
        isPrefixOrSuffix(event.target) ||
        isVerticalContent(event.target) ||
        isInput(event.target) ||
        focus.value
      ) {
        return
      }

      focus.value = true
    }

    function handleClearButtonPress() {
      props.onClearButtonClick && props.onClearButtonClick(id)
    }

    function handleKeyPress(event: KeyboardEvent) {
      const { key, which } = event
      const numbersSpec = /[\d.,eE+-]$/
      const integerSpec = /[\deE+-]$/

      if (
        !isNumericType ||
        which === Key.Enter ||
        (props.type === "number" && numbersSpec.test(key)) ||
        (props.type === "integer" && integerSpec.test(key))
      ) {
        return
      }

      event.preventDefault()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (!isNumericType) {
        return
      }

      const { key, which } = event

      if (
        props.type === "integer" &&
        (key === "ArrowUp" || which === Key.UpArrow)
      ) {
        handleNumberChange(1)
        event.preventDefault()
      }
      if (
        props.type === "integer" &&
        (key === "ArrowDown" || which === Key.DownArrow)
      ) {
        handleNumberChange(-1)
        event.preventDefault()
      }

      if ((which === Key.Home || key === "Home") && props.min !== undefined) {
        if (props.onSpinnerChange != null) {
          props.onSpinnerChange(String(props.min), id)
        } else if (props.onChange != null) {
          props.onChange(String(props.min), id)
        }
      }

      if ((which === Key.End || key === "End") && props.max !== undefined) {
        if (props.onSpinnerChange != null) {
          props.onSpinnerChange(String(props.max), id)
        } else if (props.onChange != null) {
          props.onChange(String(props.max), id)
        }
      }

      if (
        (which === Key.PageUp || key === "PageUp") &&
        props.largeStep !== undefined
      ) {
        handleNumberChange(1, props.largeStep)
      }

      if (
        (which === Key.PageDown || key === "PageDown") &&
        props.largeStep !== undefined
      ) {
        handleNumberChange(-1, props.largeStep)
      }
    }

    function handleOnBlur(event: FocusEvent) {
      focus.value = false

      if (props.onBlur) {
        props.onBlur(event)
      }
    }

    function isInput(target: HTMLElement | EventTarget) {
      return (
        target instanceof HTMLElement &&
        inputRef.value &&
        (inputRef.value.contains(target) ||
          inputRef.value.contains(document.activeElement))
      )
    }

    function isPrefixOrSuffix(target: Element | EventTarget) {
      return (
        target instanceof Element &&
        ((prefixRef.value && prefixRef.value.contains(target)) ||
          (suffixRef.value && suffixRef.value.contains(target)))
      )
    }

    function isSpinner(target: Element | EventTarget) {
      return (
        target instanceof Element &&
        spinnerRef.value &&
        spinnerRef.value.contains(target)
      )
    }

    function isVerticalContent(target: Element | EventTarget) {
      return (
        target instanceof Element &&
        verticalContentRef.value &&
        (verticalContentRef.value.contains(target) ||
          verticalContentRef.value.contains(document.activeElement))
      )
    }
  },
})

function getRows(multiline?: boolean | number) {
  if (!multiline) return undefined

  return typeof multiline === "number" ? multiline : 1
}

function normalizeAriaMultiline(multiline?: boolean | number) {
  if (!multiline) return undefined

  return Boolean(multiline) || (typeof multiline === "number" && multiline > 0)
    ? { "aria-multiline": true }
    : undefined
}
