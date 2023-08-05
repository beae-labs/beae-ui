import { useClickable } from "@beae-ui/clickable"
import { createDescendantContext } from "@beae-ui/descendant"
import { useFocusOnHide } from "@beae-ui/react-use-focus-effect"
import { usePopper, UsePopperProps } from "@beae-ui-ui/popper"
import {
  useDisclosure,
  UseDisclosureProps,
} from "@beae-ui/react-use-disclosure"
import { useOutsideClick } from "@beae-ui/react-use-outside-click"
import { useAnimationState } from "@beae-ui/react-use-animation-state"
import { createContext } from "@beae-ui/react-context"
import { getValidChildren } from "@beae-ui/react-children-utils"
import { useControllableState } from "@beae-ui/react-use-controllable-state"
import { useUpdateEffect } from "@beae-ui/react-use-update-effect"
import { mergeRefs } from "@beae-ui/react-use-merge-refs"
import { dataAttr, callAllHandlers } from "@beae-ui/shared-utils"
import { lazyDisclosure, LazyMode } from "@beae-ui/lazy-utils"

import React, {
  cloneElement,
  useCallback,
  useRef,
  useState,
  useId,
  useMemo,
  useEffect,
} from "react"
import { useShortcut } from "./use-shortcut"
import { getNextItemFromSearch } from "./get-next-item-from-search"

/* -------------------------------------------------------------------------------------------------
 * Create context to track descendants and their indices
 * -----------------------------------------------------------------------------------------------*/

export const [
  DropdownDescendantsProvider,
  useDropdownDescendantsContext,
  useDropdownDescendants,
  useDropdownDescendant,
] = createDescendantContext<HTMLElement>()

/* -------------------------------------------------------------------------------------------------
 * Create context to track dropdown state and logic
 * -----------------------------------------------------------------------------------------------*/

export const [DropdownProvider, useDropdownContext] = createContext<
  Omit<UseDropdownReturn, "descendants">
>({
  strict: false,
  name: "DropdownContext",
})

/* -------------------------------------------------------------------------------------------------
 * useDropdown hook
 * -----------------------------------------------------------------------------------------------*/

export interface UseDropdownProps
  extends Omit<UsePopperProps, "enabled">,
    UseDisclosureProps {
  /**
   * The `ref` of the element that should receive focus when the popover opens.
   */
  initialFocusRef?: React.RefObject<{ focus(): void }>
  /**
   * If `true`, the dropdown will close when a dropdown item is
   * clicked
   *
   * @default true
   */
  closeOnSelect?: boolean
  /**
   * If `true`, the dropdown will close when you click outside
   * the dropdown list
   *
   * @default true
   */
  closeOnBlur?: boolean
  /**
   * If `true`, the first enabled dropdown item will receive focus and be selected
   * when the dropdown opens.
   *
   * @default true
   */
  autoSelect?: boolean
  /**
   * Performance 🚀:
   * If `true`, the DropdownItem rendering will be deferred
   * until the dropdown is open.
   *
   * @default false
   */
  isLazy?: boolean
  /**
   * Performance 🚀:
   * The lazy behavior of dropdown's content when not visible.
   * Only works when `isLazy={true}`
   *
   * - "unmount": The dropdown's content is always unmounted when not open.
   * - "keepMounted": The dropdown's content initially unmounted,
   * but stays mounted when dropdown is open.
   *
   * @default "unmount"
   */
  lazyBehavior?: LazyMode
  /**
   * If `rtl`, proper placement positions will be flipped i.e. 'top-right' will
   * become 'top-left' and vice-verse
   */
  direction?: "ltr" | "rtl"
  /*
   * If `true`, the dropdown will be positioned when it mounts
   * (even if it's not open).
   *
   * Note 🚨: We don't recommend using this in a dropdown/popover intensive UI or page
   * as it might affect scrolling performance.
   *
   * @default false
   */
  computePositionOnMount?: boolean
}

function useIds(idProp?: string, ...prefixes: string[]) {
  const reactId = useId()
  const id = idProp || reactId
  return useMemo(() => {
    return prefixes.map((prefix) => `${prefix}-${id}`)
  }, [id, prefixes])
}

function getOwnerDocument(node?: Element | null): Document {
  return node?.ownerDocument ?? document
}

function isActiveElement(element: HTMLElement) {
  const doc = getOwnerDocument(element)
  return doc.activeElement === (element as HTMLElement)
}

/**
 * React Hook to manage a dropdown
 *
 * It provides the logic and will be used with react context
 * to propagate its return value to all children
 */
export function useDropdown(props: UseDropdownProps = {}) {
  const {
    id,
    closeOnSelect = true,
    closeOnBlur = true,
    initialFocusRef,
    autoSelect = true,
    isLazy,
    isOpen: isOpenProp,
    defaultIsOpen,
    onClose: onCloseProp,
    onOpen: onOpenProp,
    placement = "bottom-start",
    lazyBehavior = "unmount",
    direction,
    computePositionOnMount = false,
    ...popperProps
  } = props
  /**
   * Prepare the reference to the dropdown and disclosure
   */
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  /**
   * Context to register all dropdown item nodes
   */
  const descendants = useDropdownDescendants()

  const focusDropdown = useCallback(() => {
    requestAnimationFrame(() => {
      dropdownRef.current?.focus({ preventScroll: false })
    })
  }, [])

  const focusFirstItem = useCallback(() => {
    const id = setTimeout(() => {
      if (initialFocusRef) {
        initialFocusRef.current?.focus()
      } else {
        const first = descendants.firstEnabled()
        if (first) setFocusedIndex(first.index)
      }
    })
    timeoutIds.current.add(id)
  }, [descendants, initialFocusRef])

  const focusLastItem = useCallback(() => {
    const id = setTimeout(() => {
      const last = descendants.lastEnabled()
      if (last) setFocusedIndex(last.index)
    })
    timeoutIds.current.add(id)
  }, [descendants])

  const onOpenInternal = useCallback(() => {
    onOpenProp?.()
    if (autoSelect) {
      focusFirstItem()
    } else {
      focusDropdown()
    }
  }, [autoSelect, focusFirstItem, focusDropdown, onOpenProp])

  const { isOpen, onOpen, onClose, onToggle } = useDisclosure({
    isOpen: isOpenProp,
    defaultIsOpen,
    onClose: onCloseProp,
    onOpen: onOpenInternal,
  })

  useOutsideClick({
    enabled: isOpen && closeOnBlur,
    ref: dropdownRef,
    handler: (event) => {
      if (!buttonRef.current?.contains(event.target as HTMLElement)) {
        onClose()
      }
    },
  })

  /**
   * Add some popper.js for dynamic positioning
   */
  const popper: any = usePopper({
    ...popperProps,
    enabled: isOpen || computePositionOnMount,
    placement,
    direction,
  })

  const [focusedIndex, setFocusedIndex] = useState(-1)

  /**
   * Focus the button when we close the dropdown
   */
  useUpdateEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1)
    }
  }, [isOpen])

  useFocusOnHide(dropdownRef, {
    focusRef: buttonRef,
    visible: isOpen,
    shouldFocus: true,
  })

  const animationState = useAnimationState({ isOpen, ref: dropdownRef })

  /**
   * Generate unique ids for dropdown's list and button
   */
  const [buttonId, dropdownId] = useIds(id, `dropdown-button`, `dropdown-list`)

  const openAndFocusDropdown = useCallback(() => {
    onOpen()
    focusDropdown()
  }, [onOpen, focusDropdown])

  const timeoutIds = useRef<Set<any>>(new Set([]))

  useUnmountEffect(() => {
    timeoutIds.current.forEach((id) => clearTimeout(id))
    timeoutIds.current.clear()
  })

  const openAndFocusFirstItem = useCallback(() => {
    onOpen()
    focusFirstItem()
  }, [focusFirstItem, onOpen])

  const openAndFocusLastItem = useCallback(() => {
    onOpen()
    focusLastItem()
  }, [onOpen, focusLastItem])

  const refocus = useCallback(() => {
    const doc = getOwnerDocument(dropdownRef.current)
    const hasFocusWithin = dropdownRef.current?.contains(doc.activeElement)
    const shouldRefocus = isOpen && !hasFocusWithin

    if (!shouldRefocus) return

    const node = descendants.item(focusedIndex)?.node
    node?.focus()
  }, [isOpen, focusedIndex, descendants])

  /**
   * Track the animation frame which is scheduled to focus
   * a dropdown item, so it can be cancelled if another item
   * is focused before the animation executes. This prevents
   * infinite rerenders.
   */
  const rafId = useRef<number | null>(null)

  return {
    openAndFocusDropdown,
    openAndFocusFirstItem,
    openAndFocusLastItem,
    onTransitionEnd: refocus,
    unstable__animationState: animationState,
    descendants,
    popper,
    buttonId,
    dropdownId,
    forceUpdate: popper.forceUpdate,
    orientation: "vertical",
    isOpen,
    onToggle,
    onOpen,
    onClose,
    dropdownRef,
    buttonRef,
    focusedIndex,
    closeOnSelect,
    closeOnBlur,
    autoSelect,
    setFocusedIndex,
    isLazy,
    lazyBehavior,
    initialFocusRef,
    rafId,
  }
}

export interface UseDropdownReturn extends ReturnType<typeof useDropdown> {}

/* -------------------------------------------------------------------------------------------------
 * useDropdownButton hook
 * -----------------------------------------------------------------------------------------------*/
export interface UseDropdownButtonProps
  extends Omit<React.HTMLAttributes<Element>, "color"> {}

/**
 * React Hook to manage a dropdown button.
 *
 * The assumption here is that the `useDropdown` hook is used
 * in a component higher up the tree, and its return value
 * is passed as `context` to this hook.
 */
export function useDropdownButton(
  props: UseDropdownButtonProps = {},
  externalRef: React.Ref<any> = null,
) {
  const dropdown = useDropdownContext()

  const { onToggle, popper, openAndFocusFirstItem, openAndFocusLastItem } =
    dropdown

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const eventKey = event.key
      const keyMap: Record<string, React.KeyboardEventHandler> = {
        Enter: openAndFocusFirstItem,
        ArrowDown: openAndFocusFirstItem,
        ArrowUp: openAndFocusLastItem,
      }

      const action = keyMap[eventKey]

      if (action) {
        event.preventDefault()
        event.stopPropagation()
        action(event)
      }
    },
    [openAndFocusFirstItem, openAndFocusLastItem],
  )

  return {
    ...props,
    ref: mergeRefs(dropdown.buttonRef, externalRef, popper.referenceRef),
    id: dropdown.buttonId,
    "data-active": dataAttr(dropdown.isOpen),
    "aria-expanded": dropdown.isOpen,
    "aria-haspopup": "dropdown" as React.AriaAttributes["aria-haspopup"],
    "aria-controls": dropdown.dropdownId,
    onClick: callAllHandlers(props.onClick, onToggle),
    onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown),
  }
}

function isTargetDropdownItem(target: EventTarget | null) {
  // this will catch `dropdownitem`, `dropdownitemradio`, `dropdownitemcheckbox`
  return (
    isHTMLElement(target) &&
    !!target?.getAttribute("role")?.startsWith("dropdownitem")
  )
}

/* -------------------------------------------------------------------------------------------------
 * useDropdownList
 * -----------------------------------------------------------------------------------------------*/

export interface UseDropdownListProps
  extends Omit<React.HTMLAttributes<Element>, "color"> {}

/**
 * React Hook to manage a dropdown list.
 *
 * The assumption here is that the `useDropdown` hook is used
 * in a component higher up the tree, and its return value
 * is passed as `context` to this hook.
 */
export function useDropdownList(
  props: UseDropdownListProps = {},
  ref: React.Ref<any> = null,
): React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement> {
  const dropdown = useDropdownContext()

  if (!dropdown) {
    throw new Error(
      `useDropdownContext: context is undefined. Seems you forgot to wrap component within <Dropdown>`,
    )
  }

  const {
    focusedIndex,
    setFocusedIndex,
    dropdownRef,
    isOpen,
    onClose,
    dropdownId,
    isLazy,
    lazyBehavior,
    unstable__animationState: animated,
  } = dropdown

  const descendants = useDropdownDescendantsContext()

  /**
   * Hook that creates a keydown event handler that listens
   * to printable keyboard character press
   */
  const createTypeaheadHandler = useShortcut({
    preventDefault: (event) =>
      event.key !== " " && isTargetDropdownItem(event.target),
  })

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // ignore events bubbles from portal children
      if (!event.currentTarget.contains(event.target as Element)) return

      const eventKey = event.key

      const keyMap: Record<string, React.KeyboardEventHandler> = {
        Tab: (event) => event.preventDefault(),
        Escape: onClose,
        ArrowDown: () => {
          const next = descendants.nextEnabled(focusedIndex)
          if (next) setFocusedIndex(next.index)
        },
        ArrowUp: () => {
          const prev = descendants.prevEnabled(focusedIndex)
          if (prev) setFocusedIndex(prev.index)
        },
      }

      const fn = keyMap[eventKey]

      if (fn) {
        event.preventDefault()
        fn(event)
        return
      }

      /**
       * Typeahead: Based on current character pressed,
       * find the next item to be selected
       */
      const onTypeahead = createTypeaheadHandler((character) => {
        const nextItem = getNextItemFromSearch(
          descendants.values(),
          character,
          (item) => item?.node?.textContent ?? "",
          descendants.item(focusedIndex),
        )
        if (nextItem) {
          const index = descendants.indexOf(nextItem.node)
          setFocusedIndex(index)
        }
      })

      if (isTargetDropdownItem(event.target)) {
        onTypeahead(event)
      }
    },
    [
      descendants,
      focusedIndex,
      createTypeaheadHandler,
      onClose,
      setFocusedIndex,
    ],
  )

  const hasBeenOpened = useRef(false)
  if (isOpen) {
    hasBeenOpened.current = true
  }

  const shouldRenderChildren = lazyDisclosure({
    wasSelected: hasBeenOpened.current,
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
    onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown),
  }
}

/* -------------------------------------------------------------------------------------------------
 * useDropdownPosition: Composes usePopper to position the dropdown
 * -----------------------------------------------------------------------------------------------*/

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

/* -------------------------------------------------------------------------------------------------
 * useDropdownItem: Hook for each dropdown item within the dropdown list.
   We also use it in `useDropdownItemOption`
 * -----------------------------------------------------------------------------------------------*/

export interface UseDropdownItemProps
  extends Omit<React.HTMLAttributes<Element>, "color" | "disabled"> {
  /**
   * If `true`, the dropdownitem will be disabled
   */
  isDisabled?: boolean
  /**
   * If `true` and the dropdownitem is disabled, it'll
   * remain keyboard-focusable
   */
  isFocusable?: boolean
  /**
   * Overrides the parent dropdown's `closeOnSelect` prop.
   */
  closeOnSelect?: boolean
  /**
   * The type of the dropdownitem.
   */
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"]
}

export function useDropdownItem(
  props: UseDropdownItemProps = {},
  externalRef: React.Ref<any> = null,
) {
  const {
    onMouseEnter: onMouseEnterProp,
    onMouseMove: onMouseMoveProp,
    onMouseLeave: onMouseLeaveProp,
    onClick: onClickProp,
    onFocus: onFocusProp,
    isDisabled,
    isFocusable,
    closeOnSelect,
    type: typeProp,
    ...htmlProps
  } = props

  const dropdown = useDropdownContext()

  const {
    setFocusedIndex,
    focusedIndex,
    closeOnSelect: dropdownCloseOnSelect,
    onClose,
    dropdownRef,
    isOpen,
    dropdownId,
    rafId,
  } = dropdown

  const ref = useRef<HTMLDivElement>(null)
  const id = `${dropdownId}-dropdownitem-${useId()}`

  /**
   * Register the dropdownitem's node into the domContext
   */
  const { index, register } = useDropdownDescendant({
    disabled: isDisabled && !isFocusable,
  })

  const onMouseEnter = useCallback(
    (event: any) => {
      onMouseEnterProp?.(event)
      if (isDisabled) return
      setFocusedIndex(index)
    },
    [setFocusedIndex, index, isDisabled, onMouseEnterProp],
  )

  const onMouseMove = useCallback(
    (event: any) => {
      onMouseMoveProp?.(event)
      if (ref.current && !isActiveElement(ref.current)) {
        onMouseEnter(event)
      }
    },
    [onMouseEnter, onMouseMoveProp],
  )

  const onMouseLeave = useCallback(
    (event: any) => {
      onMouseLeaveProp?.(event)
      if (isDisabled) return
      setFocusedIndex(-1)
    },
    [setFocusedIndex, isDisabled, onMouseLeaveProp],
  )

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      onClickProp?.(event)
      if (!isTargetDropdownItem(event.currentTarget)) return
      /**
       * Close dropdown and parent dropdowns, allowing the DropdownItem
       * to override its parent dropdown's `closeOnSelect` prop.
       */
      if (closeOnSelect ?? dropdownCloseOnSelect) {
        onClose()
      }
    },
    [onClose, onClickProp, dropdownCloseOnSelect, closeOnSelect],
  )

  const onFocus = useCallback(
    (event: React.FocusEvent) => {
      onFocusProp?.(event)
      setFocusedIndex(index)
    },
    [setFocusedIndex, onFocusProp, index],
  )

  const isFocused = index === focusedIndex

  const trulyDisabled = isDisabled && !isFocusable

  useUpdateEffect(() => {
    if (!isOpen) return
    if (isFocused && !trulyDisabled && ref.current) {
      // Cancel any pending animations
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      rafId.current = requestAnimationFrame(() => {
        ref.current?.focus()
        rafId.current = null
      })
    } else if (dropdownRef.current && !isActiveElement(dropdownRef.current)) {
      dropdownRef.current.focus({ preventScroll: true })
    }
  }, [isFocused, trulyDisabled, dropdownRef, isOpen])

  const clickableProps = useClickable({
    onClick,
    onFocus,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    ref: mergeRefs(register, ref, externalRef),
    isDisabled,
    isFocusable,
  })

  return {
    ...htmlProps,
    ...clickableProps,
    type: typeProp ?? (clickableProps as any).type,
    id,
    role: "dropdownitem",
    tabIndex: isFocused ? 0 : -1,
  }
}

/* -------------------------------------------------------------------------------------------------
 * useDropdownOption: Composes useDropdownItem to provide a selectable/checkable dropdown item
 * -----------------------------------------------------------------------------------------------*/

export interface UseDropdownOptionOptions {
  value?: string
  isChecked?: boolean
  type?: "radio" | "checkbox"
  children?: React.ReactNode
}

export interface UseDropdownOptionProps
  extends Omit<UseDropdownItemProps, "type">,
    UseDropdownOptionOptions {}

export function useDropdownOption(
  props: UseDropdownOptionProps = {},
  ref: React.Ref<any> = null,
) {
  const { type = "radio", isChecked, ...rest } = props
  const ownProps = useDropdownItem(rest, ref)
  return {
    ...ownProps,
    role: `dropdownitem${type}`,
    "aria-checked": isChecked as React.AriaAttributes["aria-checked"],
  }
}

/* -------------------------------------------------------------------------------------------------
 * useDropdownOptionGroup: Manages the state of multiple selectable dropdownitem or dropdown option
 * -----------------------------------------------------------------------------------------------*/

export interface UseDropdownOptionGroupProps {
  value?: string | string[]
  defaultValue?: string | string[]
  type?: "radio" | "checkbox"
  onChange?: (value: string | string[]) => void
  children?: React.ReactNode
}

export function useDropdownOptionGroup(
  props: UseDropdownOptionGroupProps = {},
) {
  const {
    children,
    type = "radio",
    value: valueProp,
    defaultValue,
    onChange: onChangeProp,
    ...htmlProps
  } = props

  const isRadio = type === "radio"

  const fallback = isRadio ? "" : []

  const [value, setValue] = useControllableState({
    defaultValue: defaultValue ?? fallback,
    value: valueProp,
    onChange: onChangeProp,
  })

  const onChange = useCallback(
    (selectedValue: string) => {
      if (type === "radio" && typeof value === "string") {
        setValue(selectedValue)
      }

      if (type === "checkbox" && Array.isArray(value)) {
        const nextValue = value.includes(selectedValue)
          ? value.filter((item) => item !== selectedValue)
          : value.concat(selectedValue)

        setValue(nextValue)
      }
    },
    [value, setValue, type],
  )

  const validChildren = getValidChildren(children)

  const clones = validChildren.map((child) => {
    /**
     * We've added an internal `id` to each `DropdownItemOption`,
     * let's use that for type-checking.
     *
     * We can't rely on displayName or the element's type since
     * they can be changed by the user.
     */
    if ((child.type as any).id !== "DropdownItemOption") return child

    const onClick = (event: MouseEvent) => {
      onChange(child.props.value)
      child.props.onClick?.(event)
    }

    const isChecked =
      type === "radio"
        ? child.props.value === value
        : value.includes(child.props.value)

    return cloneElement(child, {
      type,
      onClick,
      isChecked,
    })
  })

  return {
    ...htmlProps,
    children: clones,
  }
}

export function useDropdownState() {
  const { isOpen, onClose } = useDropdownContext()
  return { isOpen, onClose }
}

function isHTMLElement(el: any): el is HTMLElement {
  if (!isElement(el)) return false
  const win = el.ownerDocument.defaultView ?? window
  return el instanceof win.HTMLElement
}

function isElement(el: any): el is Element {
  return (
    el != null &&
    typeof el == "object" &&
    "nodeType" in el &&
    el.nodeType === Node.ELEMENT_NODE
  )
}

function useUnmountEffect(fn: () => void, deps: any[] = []) {
  return useEffect(
    () => () => fn(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  )
}
