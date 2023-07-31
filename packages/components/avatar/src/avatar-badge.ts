import { h, defineComponent, PropType, computed } from "vue"
import {
  beae,
  BeaeProps,
  ComponentWithProps,
  SystemStyleObject,
  ThemingProps,
  useStyles,
  DeepPartial,
} from "@beae-ui/system"
import { getValidChildren } from "@beae-ui/utils"
import { vueThemingProps } from "@beae-ui/prop-utils"

type BadgePlacement = "top-start" | "top-end" | "bottom-start" | "bottom-end"

const placementMap: Record<BadgePlacement, SystemStyleObject> = {
  "top-start": {
    top: "0",
    insetStart: "0",
    transform: "translate(-25%, -25%)",
  },
  "top-end": {
    top: "0",
    insetEnd: "0",
    transform: "translate(25%, -25%)",
  },
  "bottom-start": {
    bottom: "0",
    insetStart: "0",
    transform: "translate(-25%, 25%)",
  },
  "bottom-end": {
    bottom: "0",
    insetEnd: "0",
    transform: "translate(25%, 25%)",
  },
}

export interface AvatarBadgeProps
  extends BeaeProps,
    ThemingProps<"AvatarBadge"> {
  placement?: BadgePlacement
}
export const AvatarBadge: ComponentWithProps<DeepPartial<AvatarBadgeProps>> =
  defineComponent({
    props: {
      placement: String as PropType<AvatarBadgeProps["placement"]>,
      ...vueThemingProps,
    },
    setup(props, { slots, attrs }) {
      const styles = useStyles()
      const placementStyles = computed(
        () => placementMap[props.placement || "bottom-end"],
      )

      const badgeStyles = computed(() => ({
        // @ts-ignore
        ...styles.value.badge,
        ...placementStyles.value,
      }))

      return () =>
        h(
          beae.div,
          {
            __label: "avatar-badge",
            __css: badgeStyles.value,
            ...props,
            ...attrs,
          },

          () => getValidChildren(slots),
        )
    },
  })
