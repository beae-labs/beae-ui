import { ref } from "vue"

export const useCheckbox = () => {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ")
  }
  return {
    classNames,
  }
}
const idRef = ref(0)

export const useId = () => {
  idRef.value += 1
  return idRef.value
}
