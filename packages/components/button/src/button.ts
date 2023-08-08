import { type PropType, defineComponent, computed, h } from "vue"

import {
  type ThemingProps,
  type HTMLBeaeProps,
  type SystemStyleObject,
  useStyleConfig,
  beae,
} from "@beae-ui/system"

import { dataAttr, filterUndefined, mergeWith } from "@beae-ui/utils"
import { useButtonGroup } from "./button-group"
import { Icon } from "@beae-ui/icon"
import { Spinner } from "@beae-ui/spinner"
import { ButtonOptions, defaultButtonProps } from "./button.utils"
import { SystemProps } from "@beae-ui/styled-system"
import { SNAO, vueThemingProps } from "@beae-ui/prop-utils"
import { getValidChildren } from "@beae-ui/utils"

export interface ButtonSpinnerProps extends HTMLBeaeProps<"div"> {
  label?: string
  spacing?: SystemProps["marginRight"]
  placement?: "start" | "end"
}

const _buttonProps = {
  label: Boolean as PropType<boolean>,
  spacing: [Number, String, Array] as PropType<
    number | string | string[] | number[]
  >,
  placement: String as PropType<"start" | "end">,
}

const ButtonSpinner = defineComponent({
  name: "ButtonSpinner",
  props: _buttonProps,
  setup(props, { attrs }) {
    const marginProp = computed(() =>
      props.placement === "start" ? "marginEnd" : "marginStart",
    )
    const spinnerStyles = computed(() => ({
      display: "flex",
      alignItems: "center",
      position: props.label ? "relative" : "absolute",
      [marginProp.value]: props.label ? props.spacing || "0.5rem" : "0",
    }))

    return () =>
      h(
        // @ts-ignore
        beae.div,
        {
          __label: "button__spinner",
          ...spinnerStyles.value,
          ...attrs,
        },
        h(Spinner, {
          width: "1em",
          height: "1em",
        }),
      )
  },
})

interface ButtonContentProps {
  leftIcon?: string
  rightIcon?: string
  iconSpacing?: ButtonSpinnerProps["spacing"]
}

export const CButtonContentProps = {
  leftIcon: "svg",
  rightIcon: "1em",
  iconSpacing: "",
}

const ButtonContent = defineComponent({
  name: "ButtonContent",
  props: {
    leftIcon: String as PropType<ButtonContentProps["leftIcon"]>,
    rightIcon: String as PropType<ButtonContentProps["rightIcon"]>,
    iconSpacing: String as PropType<ButtonContentProps["iconSpacing"]>,
  },
  setup(props, { slots }) {
    return () => [
      props.leftIcon &&
        h(ButtonIcon, {
          icon: props.leftIcon,
          marginEnd: props.iconSpacing,
        }),
      slots.defaults?.(),
      props.rightIcon &&
        h(ButtonIcon, {
          icon: props.rightIcon,
          marginStart: props.iconSpacing,
        }),
    ]
  },
})

const ButtonIcon = defineComponent({
  name: "ButtonIcon",
  props: {
    icon: String as PropType<string>,
  },
  setup(props, { attrs }) {
    return () =>
      h(Icon, {
        __label: "button__icon",
        name: props.icon,
        ...attrs,
      })
  },
})

// TODO: export type same root repo
export interface ButtonProps extends HTMLBeaeProps<"button"> {}

export const Button = defineComponent({
  name: "Button",
  props: {
    isLoading: {
      type: Boolean as PropType<ButtonOptions["isLoading"]>,
    },
    isDisabled: {
      type: Boolean as PropType<ButtonOptions["isDisabled"]>,
    },
    isActive: {
      type: Boolean as PropType<ButtonOptions["isActive"]>,
    },
    loadingText: {
      type: String as PropType<ButtonOptions["loadingText"]>,
    },
    isFullWidth: {
      type: Boolean as PropType<ButtonOptions["isFullWidth"]>,
    },
    type: {
      type: String as PropType<ButtonOptions["type"]>,
    },
    leftIcon: {
      type: String as PropType<ButtonOptions["leftIcon"]>,
    },
    rightIcon: {
      type: String as PropType<ButtonOptions["rightIcon"]>,
    },
    iconSpacing: {
      type: SNAO as PropType<ButtonOptions["iconSpacing"]>,
    },
    spinnerPlacement: {
      type: String as PropType<"start" | "end">,
      default: "start",
    },
    ...vueThemingProps,
  },
  setup(_props, { attrs, slots }) {
    const props = computed(() =>
      mergeWith({}, defaultButtonProps, _props, attrs),
    )
    const themingProps = computed<ThemingProps>(() =>
      filterUndefined({
        colorScheme: props.value.colorScheme,
        variant: props.value.variant,
        size: props.value.size,
        styleConfig: props.value.styleConfig,
      }),
    )

    const group = useButtonGroup()
    const styles = useStyleConfig(
      "Button",
      computed(() => ({ ...group?.value, ...themingProps.value })),
    )

    const _focus = computed<SystemStyleObject>(() =>
      // TODO: check _focus prop in styles
      // @ts-ignore
      mergeWith({}, styles.value?.["_focus"] ?? {}, {
        zIndex: 1,
      }),
    )

    const buttonStyles = computed<SystemStyleObject>(() => ({
      display: "inline-flex",
      appearance: "none",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 250ms",
      userSelect: "none",
      position: "relative",
      whiteSpace: "nowrap",
      verticalAlign: "middle",
      outline: "none",
      width: props.value.isFullWidth ? "100%" : "auto",
      ...styles.value,
      ...(!!group?.value && { _focus: _focus.value }),
    }))

    return () =>
      h(
        beae.button,
        {
          as: props.value.as,
          label: "button",
          ...((props.value.isDisabled || props.value.isLoading) && {
            disabled: props.value.isDisabled || props.value.isLoading,
          }),
          type: props.value.as === "button" ? undefined : props.value.type,
          dataActive: dataAttr(props.value.isActive),
          dataLoading: dataAttr(props.value.isLoading),
          __css: buttonStyles.value,
          ...attrs,
        },
        () => [
          props.value.isLoading &&
            props.value.spinnerPlacement === "start" &&
            h(ButtonSpinner, {
              placement: "start",
              spacing: props.value.iconSpacing,
              __label: "button-spinner__start",
              label: props.value.loadingText,
              __css: {
                fontSize: "1em",
                lineHeight: "normal",
              },
            }),

          props.value.isLoading
            ? props.value.loadingText ||
              h(
                beae.span,
                { opacity: 0 },
                h(
                  ButtonContent,
                  {
                    leftIcon: props.value.leftIcon,
                    rightIcon: props.value.rightIcon,
                    iconSpacing: props.value.iconSpacing,
                  },
                  () => slots?.default?.(),
                ),
              )
            : h(
                ButtonContent,
                {
                  leftIcon: props.value.leftIcon,
                  rightIcon: props.value.rightIcon,
                  iconSpacing: props.value.iconSpacing,
                },
                () => getValidChildren(slots),
              ),

          props.value.isLoading &&
            props.value.spinnerPlacement === "end" &&
            h(ButtonSpinner, {
              placement: "end",
              spacing: props.value.iconSpacing,
              __label: "button-spinner__end",
              label: props.value.loadingText,
              __css: {
                fontSize: "1em",
                lineHeight: "normal",
              },
            }),
          slots?.default?.(),
        ],
      )
  },
})

export default Button
