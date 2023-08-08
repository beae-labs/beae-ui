import { computed, defineComponent, h } from "vue"
import { usePopoverContext, useStyles } from "./popover.context"
import {
  type HTMLBeaeProps,
  type SystemStyleObject,
  beae,
} from "@beae-ui/system"
import { PopoverPositioner } from "./popover-positioner"
import { match } from "@beae-ui/utils"
import { toVar } from "./popover.utils"

export interface PopoverContentProps extends HTMLBeaeProps<"div"> {}
export const PopoverContent = defineComponent({
  name: "PopoverContent",
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const api = usePopoverContext()

    const styles = useStyles()
    const contentStyles = computed<SystemStyleObject>(() => ({
      position: "relative",
      display: "flex",
      flexDirection: "column",
      ...styles.value.content,
      transformOrigin: toVar(
        "--transform-origin",
        // @ts-ignore
        api.value.positionerProps.style.transformOrigin,
      ).varRef,
    }))

    const popoverContentProps = computed(() => {
      // @ts-ignore
      const { ...rest } = { ...attrs, ...api.value.contentProps }
      return {
        ...rest,
        ...match(api.value.trigger, {
          hover: {
            onPointerenter(e: MouseEvent) {
              // @ts-ignore
              api.value.open()
            },
            onPointerleave(e: MouseEvent) {
              // @ts-ignore
              api.value.close()
            },
          },
          click: {},
        }),
      }
    })

    return () =>
      h(
        PopoverPositioner,
        {},
        h(
          beae.div,
          {
            __label: "popover__content",
            __css: contentStyles.value,
            ...popoverContentProps.value,
          },
          slots.default?.(),
        ),
      )
  },
})
