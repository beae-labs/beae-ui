import {
  type PropType,
  type DefineComponent,
  h,
  defineComponent,
  computed,
} from "vue"
import {
  type BeaeProps,
  type SystemStyleObject,
  type ThemingProps,
  beae,
  useMultiStyleConfig,
} from "@beae-ui/system"
import { Icon } from "@beae-ui/icon"
import { filterUndefined, getValidChildren } from "@beae-ui/utils"
import { vueThemingProps } from "@beae-ui/prop-utils"

interface TagOptions {
  variantColor?: string
}

export interface TagProps extends BeaeProps, TagOptions, ThemingProps<"Tag"> {}

export interface TagLabelProps extends BeaeProps, ThemingProps<"TagLabel"> {}

export const TagLabel: DefineComponent = defineComponent({
  props: {
    ...vueThemingProps,
  },
  setup(props, { slots, attrs }) {
    const themingProps = computed<ThemingProps>(() =>
      filterUndefined({
        colorScheme: props.colorScheme,
        variant: props.variant,
        size: props.size,
        styleConfig: props.styleConfig,
      }),
    )
    const styles = useMultiStyleConfig("Tag", themingProps)

    return () =>
      h(beae.span, { __css: styles.value.label, noOfLines: 1, ...attrs }, () =>
        getValidChildren(slots),
      )
  },
})

export interface TagCloseButtonProps
  extends BeaeProps,
    ThemingProps<"TagCloseButton"> {
  isDisabled?: boolean
}

const TagProps = {
  variantColor: String as PropType<TagOptions["variantColor"]>,
  ...vueThemingProps,
}

export const TagLeftIcon: DefineComponent = defineComponent({
  setup(props, { attrs }) {
    return () => h(Icon, { ...attrs, ...props, marginEnd: "0.5rem" })
  },
})

export const TagRightIcon: DefineComponent = defineComponent({
  setup(props, { attrs }) {
    return () => h(Icon, { ...attrs, ...props, marginStart: "0.5rem" })
  },
})

const CloseButtonProps = {
  isDisabled: Boolean as PropType<TagCloseButtonProps["isDisabled"]>,
  ...vueThemingProps,
}

export const TagCloseButton = defineComponent({
  props: CloseButtonProps,
  setup(props, { slots, attrs }) {
    const themingProps = computed<ThemingProps>(() =>
      filterUndefined({
        colorScheme: props.colorScheme,
        variant: props.variant,
        size: props.size,
        styleConfig: props.styleConfig,
      }),
    )

    const styles = useMultiStyleConfig("Tag", themingProps)

    const buttonStyles: SystemStyleObject = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      outline: "0",
      ...styles.value.closeButton,
    }

    return () =>
      h(
        beae.button,
        {
          "aria-label": "close",
          type: "button",
          __css: buttonStyles,
          ...attrs,
          disabled: props?.isDisabled,
        },
        slots.default
          ? () => getValidChildren(slots)
          : () => h(Icon, { name: "close" }),
      )
  },
})

export const Tag = defineComponent({
  props: TagProps,
  setup(props, { slots, attrs }) {
    const themingProps = computed<ThemingProps>(() =>
      filterUndefined({
        colorScheme: props.colorScheme,
        variant: props.variant,
        size: props.size,
        styleConfig: props.styleConfig,
      }),
    )
    const styles = useMultiStyleConfig("Tag", themingProps)
    const tagContainerStyles = computed<SystemStyleObject>(() => ({
      ...styles.value?.container,
      bg: props.variantColor ?? styles.value?.container?.bg,
    }))

    return () =>
      h(
        beae.span,
        {
          __label: "tag",
          "aria-label": "tag",
          __css: tagContainerStyles.value,
          ...attrs,
        },
        slots,
      )
  },
})
