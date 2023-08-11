import { mergeRefs } from "@beae-ui/react-use-merge-refs" // TODO: function use for Dropdown
import { useDropdownContext } from "./use-common"

export interface UseDropdownButtonProps
  extends Omit<React.HTMLAttributes<Element>, "color"> {}

export type KeyboardEventHandler = (event: KeyboardEvent) => void

export function useDropdownButton(
  props: UseDropdownButtonProps = {},
  externalRef: any = null,
) {
  const dropdown = useDropdownContext()

  const { onToggle, popper, openAndFocusFirstItem, openAndFocusLastItem } =
    dropdown

  const onKeyDown = (event: KeyboardEvent) => {
    const eventKey = event.key
    const keyMap: Record<string, KeyboardEventHandler> = {
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
  }

  return {
    ...props,
    ref: mergeRefs([dropdown.buttonRef, externalRef, popper.referenceRef]),
    id: dropdown.buttonId,
    // data-active is not supported in Vue.js
    ariaExpanded: dropdown.isOpen,
    ariaHaspopup: "menu",
    ariaControls: dropdown.menuId,
    onClick: (...args: any) => {
      onToggle(...args)
      props.onClick?.(args)
    },
    onKeyDown,
  }
}
