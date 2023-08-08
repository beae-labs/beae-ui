import { trackElementSize, ElementSize } from "@zag-js/element-size"
import { ref, watch } from "vue"

function trackMutation(el: HTMLElement | null, cb: () => void) {
  if (!el || !el.parentElement) return
  const win = el.ownerDocument?.defaultView ?? window
  const observer = new win.MutationObserver(() => {
    cb()
  })
  observer.observe(el.parentElement, { childList: true })
  return () => {
    observer.disconnect()
  }
}

export function useSizes<T extends HTMLElement | null>({
  getNodes,
  observeMutation = true,
}: {
  getNodes: () => T[]
  observeMutation?: boolean
}) {
  const sizes = ref<ElementSize[]>([])
  const count = ref(0)

  watch(count, () => {
    const elements = getNodes()

    const cleanups = elements.map((element, index) =>
      trackElementSize(element, (size) => {
        sizes.value = [
          ...sizes.value.slice(0, index),
          size,
          ...sizes.value.slice(index + 1),
        ] as ElementSize[]
      }),
    )

    if (observeMutation) {
      const firstNode = elements[0]
      cleanups.push(
        trackMutation(firstNode, () => {
          count.value = count.value + 1
        }),
      )
    }

    return () => {
      cleanups.forEach((cleanup) => {
        cleanup?.()
      })
    }
  })

  return sizes.value as Array<ElementSize | undefined>
}

function isRef(ref: any): any {
  return typeof ref === "object" && ref !== null && "current" in ref
}

export function useSize<T extends HTMLElement | null>(subject: T | any) {
  const [size] = useSizes({
    observeMutation: false,
    getNodes() {
      const node = isRef(subject) ? subject.current : subject
      return [node]
    },
  })
  return size as ElementSize | undefined
}
