import { Ref, ref } from "vue"
import { createRenderToast } from "./toast"
import { ToastPosition } from "./toast.placement"
import { CreateToastOptions, ToastMethods } from "./toast.provider"
import type {
  CloseAllToastsOptions,
  ToastId,
  ToastMessage,
  ToastOptions,
  ToastState,
} from "./toast.types"
import { findToast, getToastPosition } from "./toast.utils"

type ToastStore = ToastMethods & {
  state: Ref
  subscribe: (onStoreChange: () => void) => () => void
  removeToast: (id: ToastId, position: ToastPosition) => void
}

const initialState = {
  top: [],
  "top-left": [],
  "top-right": [],
  "bottom-left": [],
  bottom: [],
  "bottom-right": [],
}

/**
 * Store to track all the toast across all positions
 */
export const toastStore = createStore(initialState)

function createStore(initialState: ToastState): ToastStore {
  const state = ref(initialState)
  const listeners = new Set<() => void>()

  function setState(setStateFn: (values: ToastState) => ToastState) {
    state.value = setStateFn(state.value)
    listeners.forEach((l) => l())
  }

  function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      // Delete all toasts on unmount
      setState(() => initialState)
      listeners.delete(listener)
    }
  }

  function removeToast(id: ToastId, position: ToastPosition) {
    setState((prevState) => ({
      ...prevState,
      // id may be string or number
      // eslint-disable-next-line eqeqeq
      [position]: prevState[position].filter((toast) => toast.id != id),
    }))
  }

  function notify(message: ToastMessage, options: Partial<ToastOptions> = {}) {
    const toast = createToast(message, options)
    const { position, id } = toast

    console.log(toast, "too")

    setState((prevToasts) => {
      const isTop = position.includes("top")
      /**
       * - If the toast is positioned at the top edges, the
       * recent toast stacks on top of the other toasts.
       *
       * - If the toast is positioned at the bottom edges, the recent
       * toast stacks below the other toasts.
       */
      const toasts = isTop
        ? [toast, ...(prevToasts[position] ?? [])]
        : [...(prevToasts[position] ?? []), toast]
      console.log(prevToasts, "toassss", position, toasts)
      return {
        ...prevToasts,
        [position]: toasts,
      }
    })

    return id
  }

  function update(id: ToastId, options: Partial<ToastOptions> = {}) {
    if (!id) return

    setState((prevState) => {
      const nextState = { ...prevState }
      const { position, index } = findToast(nextState, id)

      if (position && index !== -1) {
        nextState[position][index] = {
          ...nextState[position][index],
          ...options,
          message: createRenderToast(options),
        }
      }

      return nextState
    })
  }
  function closeAll({ positions }: CloseAllToastsOptions = {}) {
    // only one setState here for perf reasons
    // instead of spamming this.closeToast
    setState((prev) => {
      const allPositions: ToastPosition[] = [
        "bottom",
        "bottom-right",
        "bottom-left",
        "top",
        "top-left",
        "top-right",
      ]

      const positionsToClose = positions ?? allPositions

      return positionsToClose.reduce(
        (acc: ToastState, position: ToastPosition) => {
          acc[position] = prev[position].map((toast) => ({
            ...toast,
            requestClose: true,
          }))

          return acc
        },
        { ...prev } as ToastState,
      )
    })
  }

  function close(id: ToastId) {
    setState((prevState) => {
      const position = getToastPosition(prevState, id)

      if (!position) return prevState

      return {
        ...prevState,
        [position]: prevState[position].map((toast) => {
          // id may be string or number
          // eslint-disable-next-line eqeqeq
          if (toast.id == id) {
            return {
              ...toast,
              requestClose: true,
            }
          }

          return toast
        }),
      }
    })
  }
  function isActive(id: ToastId) {
    return Boolean(findToast(state.value, id).position)
  }

  return {
    state,
    subscribe,
    /**
     * Delete a toast record at its position
     */
    removeToast,
    notify,
    update,
    closeAll,
    close,
    isActive,
  }
}

/**
 * Static id counter to create unique ids
 * for each toast
 */
let counter = 0

/**
 * Create properties for a new toast
 */
function createToast(message: ToastMessage, options: CreateToastOptions = {}) {
  counter += 1
  const id = options.id ?? counter

  const position = options.position ?? "bottom"

  return {
    id,
    message,
    position,
    duration: options.duration,
    onCloseComplete: options.onCloseComplete,
    onRequestRemove: () => toastStore.removeToast(String(id), position),
    status: options.status,
    requestClose: false,
    containerStyle: options.containerStyle,
  }
}
