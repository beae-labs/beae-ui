import { AnimatePresence, Variants } from "framer-motion"
import { Portal, PortalProps } from "@beae-ui/portal"
import { ToastComponent, ToastComponentProps } from "./toast.component"
import type {
  CloseAllToastsOptions,
  ToastId,
  ToastMessage,
  ToastOptions,
} from "./toast.types"
import type { UseToastOptions } from "./use-toast"
import { toastStore } from "./toast.store"
import { getToastListStyle } from "./toast.utils"
import { createContext } from "@beae-ui/utils"
import { PropType, h } from "vue"
import { beae } from "@beae-ui/system"
import { defineComponent } from "vue"
export interface ToastMethods {
  /**
   * Function to actually create a toast and add it
   * to state at the specified position
   */
  notify: (message: ToastMessage, options?: CreateToastOptions) => ToastId
  /**
   * Close all toasts at once.
   * If given positions, will only close those.
   */
  closeAll: (options?: CloseAllToastsOptions) => void
  /**
   * Requests to close a toast based on its id and position
   */
  close: (id: ToastId) => void
  /**
   * Update a specific toast with new options based on the
   * passed `id`
   */
  update: (id: ToastId, options: Omit<UseToastOptions, "id">) => void
  isActive: (id: ToastId) => boolean
}

export type CreateToastOptions = Partial<
  Pick<
    ToastOptions,
    | "status"
    | "duration"
    | "position"
    | "id"
    | "onCloseComplete"
    | "containerStyle"
  >
>

export type ToastProviderProps = {
  /**
   * Default options for `useToast(options)`
   *
   * @example
   * <ToastProvider defaultOptions={{ duration: 10_000, isClosable: true }} />
   */
  defaultOptions?: UseToastOptions

  /**
   * Customize the default motion config to animate the toasts your way
   *
   * @example
   * const motionVariants =
   * <ToastProvider motionVariants={motionVariants} />
   */
  motionVariants?: Variants

  /**
   * Are you looking for a way to style the toast? Use a custom `Alert` variant in the theme.
   * This property overrides the default ToastComponent with your own implementation.
   *
   * @example
   * const CustomToastComponent = (props: ToastComponentProps) => ...
   * <ToastProvider component={CustomToastComponent} />
   *
   * @default ToastComponent
   */
  component?: ToastComponentProps

  /**
   * Define the margin between toasts
   *
   * @default 0.5rem
   */
  toastSpacing?: string | number
  /**
   * Props to be forwarded to the portal component
   */
  portalProps?: Pick<PortalProps, "appendToParentPortal" | "containerRef">
}

/**
 * Passes default options down to be used by toast creator function
 */
export const [ToastOptionProvider, useToastOptionContext] = createContext<
  UseToastOptions | undefined
>({
  name: `ToastOptionsContext`,
  strict: false,
})

/**
 * Manages the creation, and removal of toasts
 * across all corners ("top", "bottom", etc.)
 */
export const ToastProvider = defineComponent({
  name: "ToastProvider",
  props: {
    defaultOptions: {} as PropType<ToastProviderProps["defaultOptions"]>,
    motionVariants: {} as PropType<ToastProviderProps["motionVariants"]>,
    component: {} as PropType<ToastProviderProps["component"]>,
    toastSpacing: [String, Number] as PropType<
      ToastProviderProps["toastSpacing"]
    >,
    portalProps: {} as PropType<ToastProviderProps["portalProps"]>,
  },
  setup(props, { slots }) {
    const state = toastStore.state
    console.log("Toast component init", state)
    const {
      motionVariants,
      component: Component = ToastComponent,
      portalProps,
    } = props

    const stateKeys = Object.keys(state.value) as Array<keyof typeof state>
    const toastList = stateKeys.map((position) => {
      const toasts = state.value[position] ?? []

      return h(
        beae.div,
        {
          role: "region",
          "aria-live": "polite",
          "aria-label": "Notifications",
          key: position,
          id: `beae-toast-manager-${position}`,
          __css: getToastListStyle(position),
        },
        () =>
          h(beae.div, { initial: false }, () =>
            toasts?.length
              ? toasts.map((toast) =>
                  h(Component, {
                    key: toast.id,
                    motionVariants: motionVariants,
                    ...toast,
                  }),
                )
              : [],
          ),
      )
    })
    console.log(toastList, "toastList")

    return () => h(Portal, { ...portalProps }, toastList)
  },
})
