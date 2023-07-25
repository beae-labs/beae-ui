import { defineComponent, h } from "vue"

import { ToastType } from "./types"

import { useToast } from "./use-toast"

const { state, hideToast } = useToast()

export const Toast = defineComponent({
  setup() {
    const closeToast = (id: string | undefined) => {
      hideToast(id)
    }
    // TODO: Chuyển sang element icon
    const toastIcon = (toast: ToastType) => {
      if (toast.icon) {
        return toast.icon
      } else {
        if (toast.type == "error") {
          return h("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            style: {
              width: "24px",
              height: "24px",
            },
            innerHTML:
              '<path d="M10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z"></path><path d="M11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path><path fill-rule="evenodd" d="M11.237 3.177a1.75 1.75 0 0 0-2.474 0l-5.586 5.585a1.75 1.75 0 0 0 0 2.475l5.586 5.586a1.75 1.75 0 0 0 2.474 0l5.586-5.586a1.75 1.75 0 0 0 0-2.475l-5.586-5.585Zm-1.414 1.06a.25.25 0 0 1 .354 0l5.586 5.586a.25.25 0 0 1 0 .354l-5.586 5.585a.25.25 0 0 1-.354 0l-5.586-5.585a.25.25 0 0 1 0-.354l5.586-5.586Z"></path>',
          })
        }
      }
      return null
    }

    // TODO: Chuyển sang element button
    const toastButtonClose = (toast: ToastType) => {
      if (toast.closable) {
        return h(
          "button",
          {
            class: "beae-button",
            onClick: () => {
              closeToast(toast.id)
            },
          },
          h("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            style: {
              width: "24px",
              height: "24px",
            },
            innerHTML:
              '<path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path>',
          }),
        )
      }
      return null
    }
    return () =>
      h(
        "div",
        {
          class: "beae-toast-container",
        },
        state.toasts.map((toast) =>
          h(
            "div",
            {
              class: "toast-item",
            },
            [
              toastIcon(toast),
              h("div", { class: "toast-item__content" }, toast.message),
              toastButtonClose(toast),
            ].filter((x) => x),
          ),
        ),
      )
  },
})
