import { defineComponent, h, PropType, computed } from "vue"
import { beae, HTMLBeaeProps, useStyles } from "@beae-ui/system"
import { warn } from "@beae-ui/utils"

type Placement = "left" | "right"

const placements = {
  left: {
    marginEnd: "-1px",
    borderEndRadius: 0,
    borderEndColor: "transparent",
  },
  right: {
    marginStart: "-1px",
    borderStartRadius: 0,
    borderStartColor: "transparent",
  },
}

const LStyledAddon = beae("div", {
  baseStyle: {
    flex: "0 0 auto",
    width: "auto",
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  },
})

export interface InputAddonProps extends HTMLBeaeProps<"div"> {
  placement?: Placement
}

/**
 * CInputAddon
 *
 * Element to append or prepend to an input
 */
export const InputAddon = defineComponent({
  name: "InputAddon",
  props: {
    placement: {
      type: String as PropType<Placement>,
      default: "left",
    },
  },
  setup(props, { slots, attrs }) {
    try {
      const placementStyles = computed(() => placements[props.placement])
      const styles = useStyles()
      return () =>
        h(
          LStyledAddon,
          {
            __css: {
              // @ts-ignore
              ...styles.value.addon,
              ...placementStyles.value,
            },
            ...attrs,
          },
          { slots },
        )
    } catch (error: any) {
      warn({
        condition: !!error,
        message:
          "`InputAddon` can only be used inside the `InputGroup` component.",
      })
      console.error(error)
      return () => null
    }
  },
})

/**
 * InputLeftAddon
 *
 * Element to prepend to the left of an input
 */
export const InputLeftAddon = defineComponent({
  name: "InputLeftAddon",
  setup(_, { slots, attrs }) {
    return () =>
      h(
        InputAddon,
        { placement: "left", __label: "input__left-addon", ...attrs },
        slots,
      )
  },
})

InputLeftAddon.id = "InputLeftAddon"

/**
 * InputRightAddon
 *
 * Element to append to the right of an input
 */
export const InputRightAddon = defineComponent({
  name: "InputRightAddon",
  setup(_, { slots, attrs }) {
    return () =>
      h(
        InputAddon,
        {
          placement: "right",
          __label: "input__right-addon",
          ...attrs,
        },
        slots,
      )
  },
})

InputRightAddon.id = "InputRightAddon"
