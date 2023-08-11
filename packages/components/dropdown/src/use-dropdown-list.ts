import { mergeRefs } from "@beae-ui/react-use-merge-refs" // TODO: function use for Dropdown
import { lazyDisclosure } from "@beae-ui/lazy-utils" // TODO: function use for Dropdown

import { useShortcut } from "./use-shortcut"
import { getNextItemFromSearch } from "./get-next-item-from-search"
import {
  useDropdownContext,
  useDropdownDescendantsContext,
  isTargetDropdownItem,
} from "./use-common"
import { KeyboardEventHandler } from "./use-dropdown-button"

export interface UseDropdownListProps
  extends Omit<React.HTMLAttributes<Element>, "color"> {}

export function useDropdownList(
  props: UseDropdownListProps = {},
  ref: any = null,
) {
  const dropdown = useDropdownContext()

  if (!dropdown) {
    throw new Error(
      `useDropdownContext: context is undefined. Seems you forgot to wrap component within <Dropdown>`,
    )
  }

  const {
    focusedIndex,
    dropdownRef,
    isOpen,
    onClose,
    dropdownId,
    isLazy,
    lazyBehavior,
    unstable__animationState: animated,
  } = dropdown

  const descendants = useDropdownDescendantsContext()

  const createTypeaheadHandler = useShortcut({
    preventDefault: (event) =>
      event.key !== " " && isTargetDropdownItem(event.target),
  })

  const onKeyDown = (event: KeyboardEvent) => {
    // ignore events bubbles from portal children
    // if (!event.currentTarget?.includes(event.target as HTMLElement)) {
    //   return
    // }
    // Need Check Again

    const eventKey = event.key

    const keyMap: Record<string, KeyboardEventHandler> = {
      Tab: (event: any) => event.preventDefault(),
      Escape: onClose,
      ArrowDown: () => {
        const next = descendants.nextEnabled(focusedIndex)
        if (next) {
          focusedIndex.value = next.index
        }
      },
      ArrowUp: () => {
        const prev = descendants.prevEnabled(focusedIndex)
        if (prev) {
          focusedIndex.value = prev.index
        }
      },
    }

    const fn = keyMap[eventKey]

    if (fn) {
      event.preventDefault()
      fn(event)
      return
    }

    const onTypeahead = createTypeaheadHandler((character: any) => {
      const nextItem = getNextItemFromSearch(
        descendants.values(),
        character,
        (item) => item?.node?.textContent ?? "",
        descendants.item(focusedIndex),
      )
      if (nextItem) {
        const index = descendants.indexOf(nextItem.node)
        focusedIndex.value = index
      }
    })

    if (isTargetDropdownItem(event.target)) {
      onTypeahead(event)
    }
  }

  const hasBeenOpened = ref(false)
  if (isOpen) {
    hasBeenOpened.value = true
  }

  const shouldRenderChildren = lazyDisclosure({
    wasSelected: hasBeenOpened.value,
    enabled: isLazy,
    mode: lazyBehavior,
    isSelected: animated.present,
  })

  return {
    ...props,
    ref: mergeRefs(dropdownRef, ref),
    children: shouldRenderChildren ? props.children : null,
    tabIndex: -1,
    role: "dropdown",
    id: dropdownId,
    style: {
      ...props.style,
      transformOrigin: "var(--popper-transform-origin)",
    },
    "aria-orientation": "vertical" as React.AriaAttributes["aria-orientation"],
    onKeyDown,
  }
}

export function useDropdownPositioner(props: any = {}) {
  const { popper, isOpen } = useDropdownContext()
  return popper.getPopperProps({
    ...props,
    style: {
      visibility: isOpen ? "visible" : "hidden",
      ...props.style,
    },
  })
}

export function useDropdownState() {
  const { isOpen, onClose } = useDropdownContext()
  return { isOpen, onClose }
}
