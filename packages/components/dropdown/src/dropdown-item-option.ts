import { defineComponent, h, PropType } from "vue"
import { beae, ComponentWithProps, DeepPartial } from "@beae-ui/system"
import { DropdownItemProps } from "./dropdown-item"
import {
  useDropdownOption,
  UseDropdownOptionOptions,
} from "./use-dropdown-option"
import { StyledDropdownItem } from "./styled-dropdown-item"
import { DropdownIcon } from "./dropdown-icon"

export const CheckIcon = defineComponent({
  setup(props, { attrs, slots }) {
    return () =>
      h(
        beae.svg,
        {
          viewBox: "0 0 14 14",
          width: "1em",
          height: "1em",
        },
        h("polygon", {
          fill: "currentColor",
          points:
            "5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039",
        }),
      )
  },
})

export interface DropdownItemOptionProps
  extends UseDropdownOptionOptions,
    Omit<DropdownItemProps, keyof UseDropdownOptionOptions | "icon"> {
  /**
   * @type React.ReactElement
   */
  icon?: string
  /**
   * @type SystemProps["mr"]
   */
  iconSpacing?: string
  isChecked?: boolean
}

export const DropdownItemOption: ComponentWithProps<
  DeepPartial<DropdownItemOptionProps>
> = defineComponent({
  props: {
    icon: String as PropType<DropdownItemOptionProps["icon"]>,
    iconSpacing: String as PropType<DropdownItemOptionProps["iconSpacing"]>,
    isChecked: Boolean as PropType<DropdownItemOptionProps["isChecked"]>,
  },
  setup(props, { attrs, slots }) {
    const optionProps = useDropdownOption()
    return () =>
      h(
        StyledDropdownItem,
        {
          optionProps,
          className: "chakra-menu__menuitem-option",
        },
        [
          props.icon != null &&
            h(
              DropdownIcon,
              {
                fontSize: "0.8em",
                marginEnd: props.iconSpacing,
                opacity: props.isChecked ? 1 : 0,
              },
              [props.icon || h(CheckIcon)],
            ),
          h("span", { style: { flex: 1 } }, slots?.default?.()),
        ],
      )
  },
})
export default DropdownItemOption
