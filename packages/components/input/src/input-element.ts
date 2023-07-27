import { computed, h, defineComponent, PropType } from "vue"
import {
  beae,
  HTMLBeaeProps,
  SystemStyleObject,
  useStyles,
} from "@beae-ui/system"

export interface InputElementProps extends HTMLBeaeProps<"div"> {
  placement?: "left" | "right"
}

const LStyledElement = beae("div", {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "0",
    zIndex: 2,
  },
})

const InputElement = defineComponent({
  name: "InputElement",
  props: {
    placement: {
      type: String as PropType<InputElementProps["placement"]>,
      default: "left",
    },
  },
  setup(props, { attrs, slots }) {
    const styles = useStyles()
    const elementStyles = computed<SystemStyleObject>(() => {
      // @ts-ignore
      const input: any = styles.value?.field
      const attr = props.placement === "left" ? "insetStart" : "insetEnd"

      return {
        [attr]: "0",
        width: input?.height || input.h,
        height: input?.height || input?.h,
        fontSize: input?.fontSize,
      }
    })

    return () =>
      h(
        LStyledElement,
        {
          __css: elementStyles.value,
          ...attrs,
        },
        slots,
      )
  },
})

// This is used in `l-input-group.ts`
InputElement.id = "InputElement"

export const InputLeftElement = defineComponent({
  name: "CInputLeftElement",
  setup(_, { attrs, slots }) {
    return () =>
      h(
        // @ts-expect-error Untyped internal prop
        CInputElement,
        { placement: "left", __label: "input__left-element", ...attrs },
        slots,
      )
  },
})

// This is used in `l-input-group.tsx`
InputLeftElement.id = "InputLeftElement"

export const InputRightElement = defineComponent({
  name: "lInputRightElement",
  setup(_, { attrs, slots }) {
    return () =>
      h(
        InputElement,
        {
          placement: "right",
          __label: "input__right-element",
          ...attrs,
        },
        slots,
      )
  },
})

// This is used in `c-input-group.tsx`
InputRightElement.id = "InputRightElement"
