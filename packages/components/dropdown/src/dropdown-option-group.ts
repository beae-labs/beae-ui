import { PropType, defineComponent, h } from "vue"
import { type DropdownGroupProps, DropdownGroup } from "./dropdown-group"
import {
  UseDropdownOptionGroupProps,
  useDropdownOptionGroup,
} from "./use-dropdown"
import { ComponentWithProps, DeepPartial } from "@beae-ui/system"

export interface DropdownOptionGroupProps
  extends UseDropdownOptionGroupProps,
    Omit<DropdownGroupProps, "value" | "defaultValue" | "onChange"> {
  className?: string
}

export const DropdownOptionGroup: ComponentWithProps<
  DeepPartial<DropdownOptionGroupProps>
> = defineComponent({
  props: {
    title: String as PropType<DropdownOptionGroupProps["title"]>,
    className: String as PropType<DropdownOptionGroupProps["className"]>,
  },
  setup(props, { attrs, slots }) {
    const ownProps = useDropdownOptionGroup(props)
    return () =>
      h(DropdownGroup, {
        title: props.title,
        className: `chakra-menu__option-group " ${props.className}`,
        ...ownProps,
      })
  },
})

export default DropdownOptionGroup
