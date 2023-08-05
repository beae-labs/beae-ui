import { isObject } from "@beae-ui/utils"

export function isInputEvent(
  value: any,
): value is { target: HTMLInputElement } {
  return value && isObject(value) && isObject(value.target)
}

/**
 * Prevent `onBlur` being fired when the checkbox label is touched
 */
export function stopEvent(event: Event) {
  event.preventDefault()
  event.stopPropagation()
}
