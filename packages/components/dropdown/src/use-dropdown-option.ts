import { getValidChildren } from "@beae-ui/react-children-utils" // TODO: function use for Dropdown
import { useControllableState } from "@beae-ui/react-use-controllable-state" // TODO: function use for Dropdown
import { UseDropdownItemProps, useDropdownItem } from "./use-dropdown-item"

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

  const onChange = (selectedValue: string) => {
    if (type === "radio" && typeof value === "string") {
      setValue(selectedValue)
    } else if (type === "checkbox" && Array.isArray(value)) {
      const nextValue = value.includes(selectedValue)
        ? value.filter((item) => item !== selectedValue)
        : value.concat(selectedValue)

      setValue(nextValue)
    }
  }

  const validChildren = getValidChildren(children)

  const clones = validChildren.map((child: any) => {
    if ((child.type as any).id !== "DropdownItemOption") {
      return child
    }

    const onClick = (event: any) => {
      onChange(child.props.value)
      child.props.onClick?.(event)
    }

    const isChecked =
      type === "radio"
        ? child.props.value === value
        : value.includes(child.props.value)

    return {
      ...child,
      type,
      onClick,
      isChecked,
    }
  })

  return {
    ...htmlProps,
    children: clones,
  }
}
