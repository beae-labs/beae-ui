import { onMounted, onUpdated, onBeforeUnmount } from "vue"

interface EventOptions {
  capture?: boolean
  passive?: boolean
  once?: boolean
}

type EventHandler = (event: Event) => void

export const useEventListener = (
  event: string,
  handler: EventHandler,
  options: EventOptions = {},
) => {
  const attachListener = () => {
    window.addEventListener(event, handler, options)
  }

  const detachListener = (prevHandler?: EventHandler) => {
    window.removeEventListener(event, prevHandler || handler, options)
  }

  onMounted(() => {
    attachListener()
  })

  onUpdated((prevProps) => {
    if (prevProps) {
      detachListener(prevProps.handler)
    }
    attachListener()
  })

  onBeforeUnmount(() => {
    detachListener()
  })
}
