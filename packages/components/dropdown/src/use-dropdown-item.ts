import { useId } from "@beae-ui/composables"
import { ref } from "vue"

import { useClickable } from "@beae-ui/clickable" // TODO: function use for Dropdown
import { useUpdateEffect } from "@beae-ui/react-use-update-effect" // TODO: function use for Dropdown
import { mergeRefs } from "@beae-ui/react-use-merge-refs" // TODO: function use for Dropdown
import {
  useDropdownContext,
  useDropdownDescendant,
  isActiveElement,
  isHTMLElement,
} from "./use-common"

export interface UseDropdownItemProps
  extends Omit<React.HTMLAttributes<Element>, "color" | "disabled"> {
  isDisabled?: boolean
  isFocusable?: boolean
  closeOnSelect?: boolean
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"]
}

export function useDropdownItem(
  props: UseDropdownItemProps = {},
  externalRef: any = null,
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
    focusedIndex,
    closeOnSelect: dropdownCloseOnSelect,
    onClose,
    dropdownRef,
    isOpen,
    dropdownId,
    rafId,
  } = dropdown

  const refHtml = ref<HTMLDivElement>()
  const id = `${dropdownId}-dropdownitem-${useId()}`
  const { index, register } = useDropdownDescendant({
    disabled: isDisabled && !isFocusable,
  })

  const onMouseEnter = (event: any) => {
    onMouseEnterProp?.(event)
    if (isDisabled) {
      return
    }
    focusedIndex.value = index
  }

  const onMouseMove = (event: any) => {
    onMouseMoveProp?.(event)
    if (refHtml.value && !isActiveElement(refHtml.value)) {
      onMouseEnter(event)
    }
  }

  const onMouseLeave = (event: any) => {
    onMouseLeaveProp?.(event)
    if (isDisabled) {
      return
    }
    focusedIndex.value = false
  }

  const onClick = (event: any) => {
    onClickProp?.(event)
    if (!isTargetDropdownItem(event.target)) {
      return
    }

    if (closeOnSelect ?? dropdownCloseOnSelect) {
      onClose()
    }
  }

  const onFocus = (event: any) => {
    onFocusProp?.(event)
    focusedIndex.value = index
  }

  const isFocused = index === focusedIndex

  const trulyDisabled = isDisabled && !isFocusable

  useUpdateEffect(() => {
    if (!isOpen) return
    if (isFocused && !trulyDisabled && refHtml.value) {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      rafId.current = requestAnimationFrame(() => {
        refHtml.value?.focus()
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
    ref: mergeRefs(register, ref, externalRef, refHtml),
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

function isTargetDropdownItem(target: EventTarget | null) {
  // this will catch `dropdownitem`, `dropdownitemradio`, `dropdownitemcheckbox`
  return (
    isHTMLElement(target) &&
    !!target?.getAttribute("role")?.startsWith("dropdownitem")
  )
}
