import {
  HTMLBeaeProps,
  beae,
  ComponentWithProps,
  DeepPartial,
} from "@beae-ui/system"
import { useDropdownStyles } from "./dropdown"
import { PropType, defineComponent, h } from "vue"

export interface DropdownGroupProps extends HTMLBeaeProps<"div"> {
  title: string
}

export const DropdownGroup: ComponentWithProps<
  DeepPartial<DropdownGroupProps>
> = defineComponent({
  props: {
    title: String as PropType<DropdownGroupProps["title"]>,
  },
  setup(props, { attrs, slots }) {
    const styles = useDropdownStyles()

    return () =>
      h(
        beae.div,
        {
          ...attrs,
          className: "dropdown__group",
          role: "group",
        },
        [
          props.title &&
            h(
              beae.p,
              {
                className: "group__title",
                ...attrs,
                __css: styles.value,
              },
              props.title,
            ),
          slots?.default?.(),
        ],
      )
  },
})

export default DropdownGroup
