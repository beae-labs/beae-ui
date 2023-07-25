export type ToastType = {
  id?: string
  message: string
  type: "message" | "success" | "error"
  duration?: number
  closable?: boolean
  icon?: string
}

export type ToastState = {
  toasts: ToastType[]
}
