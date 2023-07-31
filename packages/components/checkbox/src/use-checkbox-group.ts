import { isObject } from "@beae-ui/utils"
import { ToRefs, computed, ref } from "vue"

type EventOrValue = Event | string | number

export interface UseCheckboxGroupProps {
  /**
   * The value of the checkbox group
   */
  value?: Array<string | number>
  /**
   * The initial value of the checkbox group
   */
  defaultValue?: Array<string | number>
  /**
   * The callback fired when any children Checkbox is checked or unchecked
   */
  onChange?(value: Array<string | number>): void
  /**
   * If `true`, all wrapped checkbox inputs will be disabled
   *
   * @default false
   */
  isDisabled?: boolean
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

export function useCheckboxGroup(props: ToRefs<UseCheckboxGroupProps>) {
  const {
    defaultValue,
    value: valueProp,
    onChange,
    isDisabled,
    isNative,
  } = props

  const onChangeProp = computed(() => onChange?.value)

  const valueState = ref<boolean>(!!defaultValue?.value)
  const isControlled = valueProp?.value !== undefined
  const value = computed(() =>
    isControlled ? valueProp.value : valueState.value,
  )

  const handleChange = (eventOrValue: EventOrValue) => {
    if (!value.value) return

    const isChecked = isInputEvent(eventOrValue)
      ? eventOrValue.target.checked
      : !value.value.includes(eventOrValue)

    const selectedValue = isInputEvent(eventOrValue)
      ? eventOrValue.target.value
      : eventOrValue

    const nextValue = isChecked
      ? [...value.value, selectedValue]
      : value.value.filter((v) => String(v) !== String(selectedValue))

    valueState.value = nextValue
    onChangeProp.value?.(nextValue)
  }

  const getCheckboxProps = () => {
    const checkedKey = isNative ? "checked" : "isChecked"
    return {
      ...props,
      [checkedKey]: value.value.some(
        (val) => String(props.value) === String(val),
      ),
      onChange: handleChange,
    }
  }

  return {
    value: value.value,
    isDisabled: isDisabled?.value,
    onChange: handleChange,
    getCheckboxProps,
  }
}

export type UseCheckboxGroupReturn = ReturnType<typeof useCheckboxGroup>
