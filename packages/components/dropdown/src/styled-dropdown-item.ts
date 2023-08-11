import {
  beae,
  DeepPartial,
  ComponentWithProps,
  DOMElements,
} from "@beae-ui/system"
import { useDropdownStyles } from "./dropdown"
import { StyledDropdownItemProps } from "./dropdown-item"
import { defineComponent, PropType, computed, h } from "vue"

export const StyledDropdownItem: ComponentWithProps<
  DeepPartial<StyledDropdownItemProps>
> = defineComponent({
  props: {
    type: String as PropType<StyledDropdownItemProps["type"]>,
    as: [Object, String] as PropType<DOMElements>,
  },
  setup(props, { attrs, slots }) {
    const styles = useDropdownStyles()
    const btnType = props.as || props.type ? props.type ?? undefined : "button"
    const buttonStyles = computed(() => {
      return {
        textDecoration: "none",
        color: "inherit",
        userSelect: "none",
        display: "flex",
        width: "100%",
        alignItems: "center",
        textAlign: "start",
        flex: "0 0 auto",
        outline: 0,
        ...styles.item,
      }
    })

    return () =>
      h(beae.button, {
        type: btnType,
        ...attrs,
        __css: buttonStyles,
      })
  },
})
