import { useId } from "@beae-ui/composables"
import { computed, watchEffect } from "vue"

import { createDescendantContext } from "@beae-ui/descendant" // TODO: function use for Dropdown
import { createContext } from "@beae-ui/react-context" // TODO: function use for Dropdown

import { UseDropdownReturn } from "./use-dropdown"

export const [
  DropdownDescendantsProvider,
  useDropdownDescendantsContext,
  useDropdownDescendants,
  useDropdownDescendant,
] = createDescendantContext<HTMLElement>()

export const [DropdownProvider, useDropdownContext] = createContext<
  Omit<UseDropdownReturn, "descendants">
>({
  strict: false,
  name: "DropdownContext",
})

export function getOwnerDocument(node?: Element | null): Document {
  return node?.ownerDocument ?? document
}

export function isActiveElement(element: HTMLElement) {
  const doc = getOwnerDocument(element)
  return doc.activeElement === (element as HTMLElement)
}

export function isHTMLElement(el: any): el is HTMLElement {
  if (!isElement(el)) return false
  const win = el.ownerDocument.defaultView ?? window
  return el instanceof win.HTMLElement
}

export function isElement(el: any): el is Element {
  return (
    el != null &&
    typeof el == "object" &&
    "nodeType" in el &&
    el.nodeType === Node.ELEMENT_NODE
  )
}

const useUnmountEffect = (fn, deps = []) => {
  const stop = watchEffect(
    (onInvalidate) => {
      onInvalidate(() => {
        fn()
      })
    },
    { flush: "post", ...deps },
  )

  onBeforeUnmount(() => {
    stop()
  })
}

export function isTargetDropdownItem(target: EventTarget | null) {
  // this will catch `dropdownitem`, `dropdownitemradio`, `dropdownitemcheckbox`
  return (
    isHTMLElement(target) &&
    !!target?.getAttribute("role")?.startsWith("dropdownitem")
  )
}

export function useIds(idProp?: string, ...prefixes: string[]) {
  const vueId = useId()
  const id = idProp || vueId
  return computed(() => {
    return prefixes.map((prefix) => `${prefix}-${id}`)
  })
}
