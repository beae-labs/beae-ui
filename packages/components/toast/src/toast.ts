import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  AlertTitle,
} from "@beae-ui/alert"
import { beae } from "@beae-ui/system"
import { CloseButton } from "@beae-ui/close-button"
import { runIfFn } from "@beae-ui/shared-utils"
import type { UseToastOptions } from "./use-toast"
import type { RenderProps, ToastId } from "./toast.types"
import { getToastPlacement } from "./toast.placement"
import { toastStore } from "./toast.store"
import { PropType, defineComponent, h } from "vue"

export interface ToastProps
  extends UseToastOptions,
    Omit<AlertProps, keyof UseToastOptions> {
  onClose?: () => void
}

/**
 * The `Toast` component is used to give feedback to users after an action has taken place.
 *
 * @see Docs https://beae-ui.com/docs/components/toast
 */
export const Toast = defineComponent({
  props: {
    status: String as PropType<ToastProps["status"]>,
    variant: {
      type: String as PropType<ToastProps["variant"]>,
      default: () => "solid",
    },
    id: String as PropType<ToastProps["id"]>,
    title: String as PropType<ToastProps["title"]>,
    isClosable: Boolean as PropType<ToastProps["isClosable"]>,
    onClose: Function as PropType<ToastProps["onClose"]>,
    description: String as PropType<ToastProps["description"]>,
    colorScheme: String as PropType<ToastProps["colorScheme"]>,
    icon: String as PropType<ToastProps["icon"]>,
  },
  setup(props, {}) {
    const {
      status,
      variant,
      id,
      title,
      isClosable,
      onClose,
      description,
      colorScheme,
      icon,
    } = props

    console.log(props, "props")

    const ids = id
      ? {
          root: `toast-${id}`,
          title: `toast-${id}-title`,
          description: `toast-${id}-description`,
        }
      : undefined

    return () =>
      h(
        Alert,
        {
          addRole: false,
          status: status,
          variant: variant,
          id: ids?.root,
          alignItems: "start",
          borderRadius: "md",
          boxShadow: "lg",
          paddingEnd: 8,
          textAlign: "start",
          width: "auto",
          colorScheme: colorScheme,
        },
        () => [
          h(AlertIcon, icon),
          h(beae.div, { flex: 1, maxWidth: "100%" }, () => [
            title && h(AlertTitle, { id: ids?.title }, title),
            description &&
              h(
                AlertDescription,
                { id: ids?.description, display: "block" },
                description,
              ),
          ]),
          isClosable &&
            h(CloseButton, {
              size: "sm",
              onClick: onClose,
              position: "absolute",
              insetEnd: 1,
              top: 1,
            }),
        ],
      )
  },
})

export function createRenderToast(
  options: UseToastOptions & {
    toastComponent?: ToastProps
  } = {},
) {
  const { render, toastComponent: ToastComponent = Toast } = options
  const renderToast = <RenderProps>((props: ToastProps) => {
    console.log("render")
    if (typeof render === "function") {
      return render({ ...props, ...options })
    }
    return () =>
      h(ToastComponent, {
        ...props,
        ...options,
      })
  })
  return renderToast
}

type UseToastPromiseOption = Omit<UseToastOptions, "status">

export function createToastFn(
  dir: "ltr" | "rtl",
  defaultOptions?: UseToastOptions,
) {
  const normalizeToastOptions = (options?: UseToastOptions) => ({
    ...defaultOptions,
    ...options,
    position: getToastPlacement(
      options?.position ?? defaultOptions?.position,
      dir,
    ),
  })

  const toast = (options?: UseToastOptions) => {
    const normalizedToastOptions = normalizeToastOptions(options)
    const Message = createRenderToast(normalizedToastOptions)
    return toastStore.notify(Message, normalizedToastOptions)
  }

  toast.update = (id: ToastId, options: Omit<UseToastOptions, "id">) => {
    toastStore.update(id, normalizeToastOptions(options))
  }

  toast.promise = <Result extends any, Err extends Error = Error>(
    promise: Promise<Result>,
    options: {
      success: MaybeFunction<UseToastPromiseOption, [Result]>
      error: MaybeFunction<UseToastPromiseOption, [Err]>
      loading: UseToastPromiseOption
    },
  ) => {
    const id = toast({
      ...options.loading,
      status: "loading",
      duration: null,
    })

    promise
      .then((data) =>
        toast.update(id, {
          status: "success",
          duration: 5_000,
          ...() => runIfFn(options.success, data),
        }),
      )
      .catch((error) =>
        toast.update(id, {
          status: "error",
          duration: 5_000,
          ...() => runIfFn(options.error, error),
        }),
      )
  }

  toast.closeAll = toastStore.closeAll
  toast.close = toastStore.close
  toast.isActive = toastStore.isActive
  toast.state = toastStore.state
  console.log(toast.isActive, "ts")
  return toast
}

export type CreateToastFnReturn = ReturnType<typeof createToastFn>

type MaybeFunction<T, Args extends unknown[] = []> = T | ((...args: Args) => T)
