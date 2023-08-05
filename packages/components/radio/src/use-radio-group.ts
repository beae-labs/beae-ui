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
import { type ComputedRef } from "vue"
import { getCurrentInstance, ref } from "vue"
import { EventOrValue, UseRadioGroupProps } from "./radio.types"
import { isInputEvent } from "./radio.utils"

/**
 * `useRadioGroup` is a custom hook that provides all the state management logic for a group of radios.
 *
 * @see Docs https://ui.beae.com/docs/hooks/use-radio-group
 */
export function useRadioGroup(
  option: ComputedRef<{
    context: UseRadioGroupProps
    emit: (event: string, ...args: any[]) => void
  }>,
) {
  const {
    defaultValue,
    modelValue,
    value: valueProp,
    name: nameProp,
    isDisabled,
    isFocusable,
    isNative,
    ...htmlProps
  } = option.value.context

  const valueState = ref<string>(modelValue || valueProp || defaultValue || "")
  const isControlled = typeof modelValue !== "undefined"
  const value = ref(isControlled ? modelValue : valueState.value)

  const radioGroupRef = ref<HTMLElement>()

  const uuid = getCurrentInstance()?.uid
  const fallbackName = `radio-${uuid}`
  const name = nameProp || fallbackName

  const getRootProps = (props: any = {}) => ({
    role: "radiogroup",
    ref: radioGroupRef.value,
    ...props,
  })

  const onChange = (eventOrValue: EventOrValue) => {
    const nextValue = isInputEvent(eventOrValue)
      ? eventOrValue.target.value
      : eventOrValue

    if (!isControlled) valueState.value = nextValue as string

    value.value = String(nextValue)
    option.value.emit("change", eventOrValue)
    option.value.emit("update:modelValue", String(nextValue))
  }

  const onFocus = () => {
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

  return {
    name,
    value,
    getRootProps,
    onFocus,
    onChange,
    isDisabled,
    isFocusable,
    htmlProps,
  }
}

export type UseRadioGroupReturn = ReturnType<typeof useRadioGroup>
