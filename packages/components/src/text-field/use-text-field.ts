import { ref } from "vue"

let idCounter = 0

export const useId = (prefix = "") => {
  const id = ref(`${prefix}-${idCounter++}`)

  return id
}
