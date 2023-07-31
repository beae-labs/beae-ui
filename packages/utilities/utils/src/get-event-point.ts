import { AnyPointerEvent, PointType } from "./types"

export function isMouseEvent(event: any): event is MouseEvent {
  const win = getEventWindow(event)

  // PointerEvent inherits from MouseEvent, so we can't use a straight instanceof check.
  if (
    typeof win.PointerEvent !== "undefined" &&
    event instanceof win.PointerEvent
  ) {
    return !!(event.pointerType === "mouse")
  }

  return event instanceof win.MouseEvent
}

export function isTouchEvent(event: AnyPointerEvent): event is TouchEvent {
  const hasTouches = !!(event as TouchEvent).touches
  return hasTouches
}

export function isMultiTouchEvent(event: AnyPointerEvent) {
  return isTouchEvent(event) && event.touches.length > 1
}

export function getEventWindow(event: Event): typeof globalThis {
  return ((event as UIEvent).view ?? window) as unknown as typeof globalThis
}

function pointFromTouch(e: TouchEvent, type: PointType = "page") {
  const point = e.touches[0] || e.changedTouches[0]
  return { x: point[`${type}X`], y: point[`${type}Y`] }
}

function pointFromMouse(
  point: MouseEvent | PointerEvent,
  type: PointType = "page",
) {
  return {
    x: point[`${type}X`],
    y: point[`${type}Y`],
  }
}

export function getEventPoint(
  event: AnyPointerEvent,
  type: PointType = "page",
) {
  return isTouchEvent(event)
    ? pointFromTouch(event, type)
    : pointFromMouse(event, type)
}
