import { h, defineComponent, PropType, computed, ComputedRef } from "vue"
import {
  beae,
  ThemingProps,
  useMultiStyleConfig,
  createStylesContext,
  DOMElements,
  SystemStyleObject,
  ComponentWithProps,
  DeepPartial,
  HTMLBeaeProps,
} from "@beae-ui/system"

import { createContext, getValidChildren } from "@beae-ui/utils"
import {
  CheckIcon,
  ErrorIcon,
  InfoIcon,
  WarningIcon,
  LoadingIcon,
} from "./icons"
import { vueThemingProps } from "@beae-ui/prop-utils"

const STATUSES = {
  info: {
    colorScheme: "blue",
    icon: InfoIcon,
  },
  success: {
    colorScheme: "green",
    icon: CheckIcon,
  },
  warning: {
    colorScheme: "orange",
    icon: WarningIcon,
  },
  error: {
    colorScheme: "red",
    icon: ErrorIcon,
  },
  loading: { icon: LoadingIcon, colorScheme: "blue" },
}

const [StylesProvider, useStyles] = createStylesContext("Alert")
type AlertStatus = keyof typeof STATUSES
export type AlertVariant =
  | "solid"
  | "subtle"
  | "left-accent"
  | "top-accent"
  | "polaris"

interface AlertContext {
  status: ComputedRef<AlertStatus>
}

const [AlertProvider, useAlertContext] = createContext<AlertContext>({
  name: "AlertContext",
  errorMessage:
    "useAlertContext: `context` is undefined. Seems you forgot to wrap alert components in `<Lalert />`",
})

interface AlertOptions {
  /**
   * The status of the alert
   * @default "info"
   */
  status?: AlertStatus
}
export interface AlertProps
  extends HTMLBeaeProps<"div">,
    AlertOptions,
    ThemingProps<"Alert"> {
  /**
   * @default false
   */
  addRole?: boolean
}
import { toRefs } from "vue"

export const Alert: ComponentWithProps<DeepPartial<AlertProps>> =
  defineComponent({
    name: "Alert",
    props: {
      as: {
        type: [String, Object] as PropType<DOMElements>,
        default: "div",
      },
      status: String as PropType<AlertProps["status"]>,
      ...vueThemingProps,
    },
    setup(props, { slots, attrs }) {
      const { status, colorScheme, variant } = toRefs(props)

      const computedColorScheme = computed(
        () =>
          colorScheme.value || STATUSES?.[status?.value]?.colorScheme || "blue",
      )
      const themingProps = computed<ThemingProps>(() => ({
        colorScheme: computedColorScheme.value,
        variant: variant.value,
      }))

      const styles = useMultiStyleConfig("Alert", themingProps)

      const alertStyles = computed<SystemStyleObject>(() => ({
        width: "100%",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        ...styles.value.container,
      }))
      AlertProvider({ status: status })
      StylesProvider(styles)

      return () =>
        h(
          beae.div,
          {
            role: "alert",
            __label: "alert",
            __css: alertStyles.value,
            ...attrs,
          },
          () => getValidChildren(slots),
        )
    },
  })

export interface AlertTitleProps extends HTMLBeaeProps<"div"> {}
export const AlertTitle: ComponentWithProps<DeepPartial<AlertTitleProps>> =
  defineComponent({
    name: "AlertTitle",
    setup(_, { attrs, slots }) {
      const styles = useStyles()

      return () =>
        h(
          beae.div,
          {
            __label: "alert__title",
            // TODO: add text into type of useStyleConfig
            // @ts-ignore
            __css: styles.value?.title,
            ...attrs,
          },
          slots,
        )
    },
  })
export interface AlertDescriptionProps extends HTMLBeaeProps<"div"> {}
export const AlertDescription: ComponentWithProps<
  DeepPartial<AlertDescriptionProps>
> = defineComponent({
  name: "AlertDescription",
  setup(_, { attrs, slots }) {
    const styles = useStyles()
    return () => {
      return h(
        beae.div,
        {
          __label: "alert__description",
          // TODO: add text into type of useStyleConfig
          // @ts-ignore
          __css: styles.value?.description,
          ...attrs,
        },
        () => getValidChildren(slots),
      )
    }
  },
})
export interface AlertIconProps extends HTMLBeaeProps<"span"> {}
export const AlertIcon: ComponentWithProps<DeepPartial<AlertIconProps>> =
  defineComponent({
    name: "AlertIcon",
    setup(_, { attrs, slots }) {
      const styles = useStyles()
      const { status } = useAlertContext()
      console.log(status.value, "status")
      const { icon: BaseIcon } = STATUSES?.[status?.value] ?? {
        colorScheme: "blue",
        icon: InfoIcon,
      }

      const css = computed(() =>
        // TODO: add text into type of useStyleConfig
        // TODO: Issue loading on alert component not working
        // @ts-ignore
        status.value === "loading" ? styles.value?.spinner : styles.value?.icon,
      )

      const validChildren = getValidChildren(slots)

      return () =>
        h(
          beae.span,
          {
            display: "inherit",
            __label: "alert__icon",
            ...attrs,
            // TODO: add text into type of useStyleConfig
            // @ts-ignore
            __css: css.value,
          },
          () =>
            validChildren.length
              ? slots
              : h(BaseIcon, { h: "100%", w: "100%" }),
        )
    },
  })
