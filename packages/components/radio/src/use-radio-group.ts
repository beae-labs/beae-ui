/**
 * 📝 Notes for Contributors:
 *
 * - When creating an interactive component, we recommend creating hooks that
 * handles accessibility, state management, and behavior concerns.
 *
 * - Hooks should return prop-getters and some state information.
 *
 * > If you're not creating an interactive component, you can delete this file.
 *
 * @see https://ui.beae.com/guides/component-guide
 */
import { ToRefs, getCurrentInstance, ref } from "vue"
import { isObject } from "@beae-ui/utils"

type EventOrValue = Event | string | number

export interface UseRadioGroupProps {
  /**
   * The value of the radio to be `checked`
   * (in controlled mode)
   */
  value?: string
  /**
   * The value of the radio to be `checked`
   * initially (in uncontrolled mode)
   */
  defaultValue?: string
  /**
   * Function called once a radio is checked
   * @param nextValue the value of the checked radio
   */
  onChange?(nextValue: string): void
  /**
   * If `true`, all wrapped radio inputs will be disabled
   *
   * @default false
   */
  isDisabled?: boolean
  /**
   * If `true` and `isDisabled` is true, all wrapped radio inputs will remain
   * focusable but not interactive.
   *
   * @default false
   */
  isFocusable?: boolean
  /**
   * The `name` attribute forwarded to each `radio` element
   */
  name?: string
  /**
   * If `true`, input elements will receive
   * `checked` attribute instead of `isChecked`.
   *
   * This assumes, you're using native radio inputs
   *
   * @default false
   */
  isNative?: boolean
}

function isInputEvent(value: any): value is { target: HTMLInputElement } {
  return value && isObject(value) && isObject(value.target)
}

/**
 * `useRadioGroup` is a custom hook that provides all the state management logic for a group of radios.
 *
 * @see Docs https://ui.beae.com/docs/hooks/use-radio-group
 */
export function useRadioGroup(props: ToRefs<UseRadioGroupProps>) {
  const {
    onChange: onChangeProp,
    value: valueProp,
    defaultValue,
    name: nameProp,
    isDisabled,
    isFocusable,
    isNative,
    ...htmlProps
  } = props

  const valueState = ref<string | number>(props.defaultValue?.value || "")
  const isControlled = typeof props.value?.value !== "undefined"
  const value = isControlled ? props.value?.value : valueState.value

  const radioGroupRef = ref<HTMLElement>()

  const focus = () => {
    const rootNode = radioGroupRef.value
    if (!rootNode) return

    let query = `input:not(:disabled):checked`

    const firstEnabledAndCheckedInput = rootNode.querySelector(
      query,
    ) as HTMLElement

    if (firstEnabledAndCheckedInput) {
      firstEnabledAndCheckedInput?.focus()
      return
    }

    query = `input:not(:disabled)`

    const firstEnabledInput = rootNode.querySelector(query) as HTMLElement
    firstEnabledInput?.focus()
  }

  /**
   * Note: All radio options must use the same name
   */
  const uuid = getCurrentInstance()?.uid
  const fallbackName = `radio-${uuid}`
  const name = nameProp?.value || fallbackName

  const onChange = (eventOrValue: EventOrValue) => {
    const nextValue = isInputEvent(eventOrValue)
      ? eventOrValue.target.value
      : eventOrValue

    if (!isControlled) valueState.value = nextValue as number | string

    props.onChange?.value?.(String(nextValue))
  }

  const getRootProps = (_props: any = {}) => ({
    role: "radiogroup",
    ref: radioGroupRef.value,
    ..._props,
  })

  return {
    getRootProps,
    name,
    focus,
    value,
    onChange,
    isDisabled: props.isDisabled?.value,
    isFocusable: props.isFocusable?.value,
    htmlProps,
  }
}

export type UseRadioGroupReturn = ReturnType<typeof useRadioGroup>
