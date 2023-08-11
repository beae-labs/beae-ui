import {
  HTMLBeaeProps,
  SystemProps,
  ComponentWithProps,
  DeepPartial,
} from "@beae-ui/system"

import { DropdownCommand } from "./dropdown-command"
import { DropdownIcon } from "./dropdown-icon"
import { StyledDropdownItem } from "./styled-dropdown-item"
import { useDropdownItem, UseDropdownItemProps } from "./use-dropdown-item"
import { defineComponent, PropType, VNodeProps, h } from "vue"

export interface StyledDropdownItemProps extends HTMLBeaeProps<"button"> {
  type: string
}

interface DropdownItemOptions
  extends Pick<
    UseDropdownItemProps,
    "isDisabled" | "isFocusable" | "closeOnSelect"
  > {
  /**
   * The icon to render before the menu item's label.
   * @type React.ReactElement
   */
  icon?: string
  /**
   * The spacing between the icon and menu item's label.
   * @type SystemProps["mr"]
   */
  iconSpacing?: SystemProps["mr"]
  /**
   * Right-aligned label text content, useful for displaying hotkeys.
   */
  command?: string
  /**
   * The spacing between the command and menu item's label.
   * @type SystemProps["ml"]
   */
  commandSpacing?: SystemProps["ml"]
}

type HTMLAttributes = VNodeProps

type IsDisabledProps = "disabled" | "aria-disabled"

export interface DropdownItemProps
  extends Omit<HTMLBeaeProps<"button">, IsDisabledProps>,
    DropdownItemOptions {
  icon?: string
  iconSpacing?: string
  command?: string
  commandSpacing?: string
}

export const DropdownItem: ComponentWithProps<DeepPartial<DropdownItemProps>> =
  defineComponent({
    props: {
      icon: String as PropType<DropdownItemProps["icon"]>,
      iconSpacing: {
        type: String as PropType<DropdownItemProps["iconSpacing"]>,
        default: "0.75rem",
      },
      command: String as PropType<DropdownItemProps["command"]>,
      commandSpacing: {
        type: String as PropType<DropdownItemProps["commandSpacing"]>,
        default: "0.75re,",
      },
    },
    setup(props, { attrs, slots }) {
      const {
        icon,
        iconSpacing = "0.75rem",
        command,
        commandSpacing = "0.75rem",
        ...rest
      } = props
      const menuItemProps = useDropdownItem(rest) as HTMLAttributes
      const shouldWrap = props.icon || props.command
      const _children = shouldWrap
        ? h(
            "span",
            { style: { pointerEvents: "none", flex: 1 } },
            slots?.default?.(),
          )
        : slots?.default?.()

      return () =>
        h(
          StyledDropdownItem,
          {
            ...menuItemProps,
          },
          [
            props.icon &&
              h(
                DropdownIcon,
                {
                  fontSize: "0.8em",
                  marginEnd: props.iconSpacing,
                },
                props.icon,
              ),
            _children,
            props.command &&
              h(
                DropdownCommand,
                {
                  marginStart: props.commandSpacing,
                },
                props.command,
              ),
          ],
        )
    },
  })
