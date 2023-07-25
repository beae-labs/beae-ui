import { reactive } from "vue"

import { ToastState, ToastType } from "./types"

const state = reactive<ToastState>({
  toasts: [],
})

export function useToast() {
  function generateID(length: number): string {
    let result = []
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for (var i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * characters.length)),
      )
    }
    return result.join("")
  }

  function showToast(toast: ToastType) {
    state.toasts.push({
      id: generateID(10),
      message: toast.message,
      type: toast.type,
      duration: toast.duration,
      closable: toast.closable != undefined ? toast.closable : true,
      icon: toast.icon,
    })
    setTimeout(() => {
      hideToast(toast.id)
    }, toast.duration || 5000)
  }
  function hideToast(toastId: string | undefined) {
    console.log("hideToast", toastId)
    if (toastId) {
      state.toasts = state.toasts.filter((toast) => toast.id !== toastId)
    } else {
      state.toasts.pop()
    }
  }
  return { state, showToast, hideToast }
}
