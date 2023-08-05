import { type ComputedRef, ref } from "vue"
import { EventOrValue, type UseCheckboxGroupProps } from "./checkbox.types"
import { isInputEvent } from "./checkbox.utils"

export function useCheckboxGroup(
  option: ComputedRef<{
    context: UseCheckboxGroupProps
    emit: (event: "change" | "update:modelValue", ...args: any[]) => void
  }>,
) {
  const {
    defaultValue,
    modelValue,
    value: valueProp,
    isDisabled,
    isNative,
  } = option.value.context

  const valueState = ref<UseCheckboxGroupProps["modelValue"]>(
    modelValue || valueProp || defaultValue || [],
  )
  const isControlled = typeof modelValue !== "undefined"
  const valueGroup = ref(isControlled ? modelValue : valueState.value)

  const radioGroupRef = ref<HTMLElement>()

  const onChange = (eventOrValue: EventOrValue) => {
    if (!valueGroup.value) return

    const isChecked = isInputEvent(eventOrValue)
      ? eventOrValue.target.checked
      : !valueGroup.value?.includes(eventOrValue as string | number)

    const selectedValue = isInputEvent(eventOrValue)
      ? eventOrValue.target.value
      : (eventOrValue as string | number)

    const nextValue = isChecked
      ? [...valueGroup.value, selectedValue]
      : valueGroup.value.filter(
          (value) => String(value) !== String(selectedValue),
        )

    valueGroup.value = nextValue
    option.value.emit("change", nextValue)
    option.value.emit("update:modelValue", nextValue)
  }

  const getCheckboxGroupProps = (props: any = {}) => {
    const checkedKey = isNative ? "checked" : "isChecked"

    return {
      [checkedKey]: valueGroup.value?.some(
        (value) => String(valueProp) === String(value),
      ),
      onChange,
      ...props,
    }
  }

  const getRootProps = (props: any = {}) => ({
    role: "checkboxgroup",
    ref: radioGroupRef.value,
    ...props,
  })

  return {
    isDisabled,
    getCheckboxGroupProps,
    getRootProps,
    onChange,
    value: valueGroup,
  }
}

export type UseCheckboxGroupReturn = ReturnType<typeof useCheckboxGroup>
