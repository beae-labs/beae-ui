import { PropType, defineComponent, h } from "vue"
import { type DropdownGroupProps, DropdownGroup } from "./dropdown-group"
import {
  UseDropdownOptionGroupProps,
  useDropdownOptionGroup,
} from "./use-dropdown-option"
import { ComponentWithProps, DeepPartial } from "@beae-ui/system"

export interface DropdownOptionGroupProps
  extends UseDropdownOptionGroupProps,
    Omit<DropdownGroupProps, "value" | "defaultValue" | "onChange"> {}

export const DropdownOptionGroup: ComponentWithProps<
  DeepPartial<DropdownOptionGroupProps>
> = defineComponent({
  props: {
    title: String as PropType<DropdownOptionGroupProps["title"]>,
  },
  setup(props, { attrs, slots }) {
    const ownProps = useDropdownOptionGroup(attrs)
    return () =>
      h(DropdownGroup, {
        title: props.title,
        ...ownProps,
      })
  },
})

export default DropdownOptionGroup
