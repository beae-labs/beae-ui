import type { UseCheckboxGroupProps } from "./checkbox.types"
import { computed, ref } from "vue"

export function useCheckboxGroup(props: UseCheckboxGroupProps) {
  const valueState = ref<boolean>(!!props.value.context?.value.modelValue)

  return {
    value: props.value.context.value.modelValue,
    isDisabled: props.value.context.value.isDisabled,
  }
}
