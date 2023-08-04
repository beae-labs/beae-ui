import type { AlertStatus } from "@beae-ui/alert"
import { StyleProps, ThemingProps, useBeae } from "@beae-ui/system"
import type { RenderProps, ToastId, ToastOptions } from "./toast.types"
import { createToastFn, CreateToastFnReturn } from "./toast"
import { ToastPosition } from "./toast.placement"
import { useToastOptionContext } from "./toast.provider"
import { computed } from "vue"

export interface UseToastOptions extends ThemingProps<"Alert"> {
  /**
   * The placement of the toast
   *
   * @default "bottom"
   */
  position?: ToastPosition
  /**
   * The delay before the toast hides (in milliseconds)
   * If set to `null`, toast will never dismiss.
   *
   * @default 5000 ( = 5000ms )
   */
  duration?: ToastOptions["duration"]
  /**
   * Render a component toast component.
   * Any component passed will receive 2 props: `id` and `onClose`.
   */
  render?(props: RenderProps): Node
  /**
   * The title of the toast
   */
  title?: String
  /**
   * The description of the toast
   */
  description?: String
  /**
   * If `true`, toast will show a close button
   * @default false
   */
  isClosable?: boolean
  /**
   * The status of the toast.
   */
  status?: AlertStatus
  /**
   * A custom icon that will be displayed by the toast.
   */
  icon?: String
  /**
   * The `id` of the toast.
   *
   * Mostly used when you need to prevent duplicate.
   * By default, we generate a unique `id` for each toast
   */
  id?: ToastId
  /**
   * Callback function to run side effects after the toast has closed.
   */
  onCloseComplete?: () => void
  /**
   * Optional style overrides for the container wrapping the toast component.
   */
  containerStyle?: StyleProps
}

/**
 * React hook used to create a function that can be used
 * to show toasts in an application.
 */
export function useToast(options?: UseToastOptions): CreateToastFnReturn {
  const { theme } = useBeae()
  const defaultOptions = useToastOptionContext()

  return computed(() =>
    createToastFn(theme.direction, {
      ...defaultOptions,
      ...options,
    }),
  ).value
}

export default useToast
