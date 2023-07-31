import { Box, Wrap, WrapItem, WrapProps } from "@beae-ui/layout"
import {
  ThemingProps,
  useMultiStyleConfig,
  beae,
  ComponentWithProps,
  DeepPartial,
} from "@beae-ui/system"
import { createContext, getValidChildren } from "@beae-ui/utils"
import { vueThemingProps } from "@beae-ui/prop-utils"
import { filterUndefined } from "@beae-ui/utils"

import { h, defineComponent, computed, ComputedRef, PropType } from "vue"

type AvatarGroupContext = ComputedRef<ThemingProps>

const [AvatarGroupProvider, useAvatarGroup] = createContext<AvatarGroupContext>(
  {
    strict: false,
    name: "AvatarGroupContext",
  },
)

export { useAvatarGroup }

export interface AvatarTextProps {
  text: String
}

export const AvatarText: ComponentWithProps<DeepPartial<AvatarTextProps>> =
  defineComponent({
    props: {
      text: {
        type: String as PropType<AvatarTextProps["text"]>,
        default: "",
      },
      ...vueThemingProps,
    },
    setup(props, ctx) {
      const themingProps = computed<ThemingProps>(() =>
        filterUndefined({
          colorScheme: props.colorScheme,
          variant: props.variant,
          size: props.size,
          styleConfig: props.styleConfig,
        }),
      )
      const styles = useMultiStyleConfig("Avatar", themingProps)
      const containerStyles = computed(() => ({
        ...styles.value.container,
        display: styles.value.container.display || "flex",
        alignItems: "center",
        justifyContent: "center",
      }))
      const labelStyles = computed(() => ({
        ...styles.value.label,
        fontWeight: "medium",
      }))

      return () =>
        h(
          beae.div,
          { __css: containerStyles.value, ...ctx.attrs },
          h(
            beae.div,
            {
              role: "img",
              __css: labelStyles.value,
            },
            () => [props.text],
          ),
        )
    },
  })

export interface AvatarGroupProps {
  max: Number
}

export const AvatarGroup: ComponentWithProps<DeepPartial<AvatarGroupProps>> =
  defineComponent({
    props: {
      max: {
        type: Number,
        default: 2,
      },
      ...WrapProps,
      ...vueThemingProps,
    },
    setup(props, { slots, attrs }) {
      const wrapProps = computed(
        () =>
          ({
            spacing: props.spacing || "-0.75em",
            direction: props.direction || "row-reverse",
            justify: props.justify,
            align: props.align,
            shouldWrapChildren: props.shouldWrapChildren,
          }) as WrapProps,
      )
      const themingProps = computed<ThemingProps>(() =>
        filterUndefined({
          colorScheme: props.colorScheme,
          variant: props.variant,
          size: props.size,
          styleConfig: props.styleConfig,
        }),
      )
      const validChildren = computed(() => getValidChildren(slots))
      const visibleChildren = computed(() =>
        validChildren.value.slice(0, props.max),
      )
      const nbHidden = computed(() => validChildren.value.length - props.max)

      AvatarGroupProvider(themingProps)

      return () =>
        h(
          Box,
          {
            __label: "avatar-group",
            display: "flex",
            ...attrs,
          },
          // @ts-ignore
          h(Wrap, { ...wrapProps.value }, () => [
            nbHidden.value > 0 &&
              h(
                WrapItem,
                h(AvatarText, {
                  ...themingProps.value,
                  text: `+${nbHidden.value}`,
                }),
              ),
            visibleChildren.value.map((child: any) => (h(WrapItem), child)),
          ]),
        )
    },
  })

export default AvatarGroup
