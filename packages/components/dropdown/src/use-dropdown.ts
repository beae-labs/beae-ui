import { ref, Ref } from "vue"

import { useFocusOnHide } from "@beae-ui/react-use-focus-effect" // TODO: function use for Dropdown
import { usePopper, UsePopperProps } from "@beae-ui/popper" // TODO: function use for Dropdown
import {
  useDisclosure,
  UseDisclosureProps,
} from "@beae-ui/react-use-disclosure" // TODO: function use for Dropdown
import { useOutsideClick } from "@beae-ui/react-use-outside-click" // TODO: function use for Dropdown
import { useAnimationState } from "@beae-ui/react-use-animation-state" // TODO: function use for Dropdown
import { useUpdateEffect } from "@beae-ui/react-use-update-effect" // TODO: function use for Dropdown
import { LazyMode } from "@beae-ui/lazy-utils" // TODO: function use for Dropdown

import {
  getOwnerDocument,
  useDropdownDescendants,
  useIds,
  useUnmountEffect,
} from "./use-common"

export interface UseDropdownProps
  extends Omit<UsePopperProps, "enabled">,
    UseDisclosureProps {
  initialFocusRef?: Ref<{ focus(): void }>
  closeOnSelect?: boolean
  closeOnBlur?: boolean
  autoSelect?: boolean
  isLazy?: boolean
  lazyBehavior?: LazyMode
  direction?: "ltr" | "rtl"
  computePositionOnMount?: boolean
}

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

  const dropdownRef = ref<HTMLDivElement>()
  const buttonRef = ref<HTMLButtonElement>()

  const descendants = useDropdownDescendants()

  const focusDropdown = () => {
    requestAnimationFrame(() => {
      dropdownRef.value?.focus({ preventScroll: false })
    })
  }

  const focusFirstItem = () => {
    const id = setTimeout(() => {
      if (initialFocusRef) {
        initialFocusRef.value?.focus()
      } else {
        const first = descendants.firstEnabled()
        if (first) focusedIndex.value = first.index
      }
    })
    timeoutIds.value.add(id)
  }

  const focusLastItem = () => {
    const id = setTimeout(() => {
      const last = descendants.lastEnabled()
      if (last) focusedIndex.value = last.index
    })
    timeoutIds.value.add(id)
  }

  const onOpenInternal = () => {
    onOpenProp?.()
    if (autoSelect) {
      focusFirstItem()
    } else {
      focusDropdown()
    }
  }

  const { isOpen, onOpen, onClose, onToggle } = useDisclosure({
    isOpen: isOpenProp,
    defaultIsOpen,
    onClose: onCloseProp,
    onOpen: onOpenInternal,
  })

  useOutsideClick({
    enabled: isOpen && closeOnBlur,
    ref: dropdownRef,
    handler: (event: MouseEvent) => {
      if (!buttonRef.value?.contains(event.target as HTMLElement)) {
        onClose()
      }
    },
  })

  const popper: any = usePopper({
    ...popperProps,
    enabled: isOpen || computePositionOnMount,
    placement,
    direction,
  })

  const focusedIndex = ref<boolean>(false)

  useUpdateEffect(() => {
    if (!isOpen) {
      focusedIndex.value = false
    }
  }, [isOpen])

  useFocusOnHide(dropdownRef, {
    focusRef: buttonRef,
    visible: isOpen,
    shouldFocus: true,
  })

  const animationState = useAnimationState({ isOpen, ref: dropdownRef })

  const buttonId = useIds(id, `dropdown-button`)
  const dropdownId = useIds(id, `dropdown-list`)
  const openAndFocusDropdown = () => {
    onOpen()
    focusDropdown()
  }

  const timeoutIds = ref<Set<any>>(new Set([]))

  useUnmountEffect(() => {
    timeoutIds.value.forEach((id) => clearTimeout(id))
    timeoutIds.value.clear()
  })

  const openAndFocusFirstItem = () => {
    onOpen()
    focusFirstItem()
  }

  const openAndFocusLastItem = () => {
    onOpen()
    focusLastItem()
  }

  const refocus = () => {
    const doc = getOwnerDocument(dropdownRef.value)
    const hasFocusWithin = dropdownRef.value?.contains(doc.activeElement)
    const shouldRefocus = isOpen && !hasFocusWithin

    if (!shouldRefocus) return

    const node = descendants.item(focusedIndex)?.node
    node?.focus()
  }

  const rafId = ref<number | null>(null)

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
    isLazy,
    lazyBehavior,
    initialFocusRef,
    rafId,
  }
}

export interface UseDropdownReturn extends ReturnType<typeof useDropdown> {}
