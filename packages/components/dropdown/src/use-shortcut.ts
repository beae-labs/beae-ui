import { ref, onBeforeUnmount } from "vue"

/**
 * Checks if the key pressed is a printable character
 * and can be used for shortcut navigation
 */
function isPrintableCharacter(event: KeyboardEvent) {
  const { key } = event
  return key.length === 1 || (key.length > 1 && /[^a-zA-Z0-9]/.test(key))
}

export interface UseShortcutProps {
  timeout?: number
  preventDefault?: (event: KeyboardEvent) => boolean
}

/**
 * Vue.js composition function that provides an enhanced keydown handler,
 * that's used for key navigation within menus, select dropdowns.
 */
export function useShortcut(props: UseShortcutProps = {}) {
  const { timeout = 300, preventDefault = () => true } = props

  const keys = ref<string[]>([])
  const timeoutRef = ref<any>()

  const flush = () => {
    if (timeoutRef.value) {
      clearTimeout(timeoutRef.value)
      timeoutRef.value = null
    }
  }

  const clearKeysAfterDelay = () => {
    flush()
    timeoutRef.value = setTimeout(() => {
      keys.value = []
      timeoutRef.value = null
    }, timeout)
  }

  onBeforeUnmount(flush)

  type Callback = (keysSoFar: string) => void

  function onKeyDown(fn: Callback) {
    return (event: KeyboardEvent) => {
      if (event.key === "Backspace") {
        keys.value.pop()
        return
      }

      if (isPrintableCharacter(event)) {
        const keysCopy = [...keys.value, event.key]

        if (preventDefault(event)) {
          event.preventDefault()
          event.stopPropagation()
        }

        keys.value = keysCopy
        fn(keysCopy.join(""))

        clearKeysAfterDelay()
      }
    }
  }

  return onKeyDown
}
