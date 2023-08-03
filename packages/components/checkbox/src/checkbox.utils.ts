import { isObject } from "@beae-ui/utils"

export function isInputEvent(
  value: any,
): value is { target: HTMLInputElement } {
  return value && isObject(value) && isObject(value.target)
}
