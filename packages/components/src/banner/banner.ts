import { defineComponent, h } from "vue"
import { classNames } from "@beae-ui/utils"

// TODO: use beae button component instead of button html element
export type ActionType = {
  type: "button" | "link"
  class: string
  label: string
  handle: () => void
}

export const Banner = defineComponent({
  props: {
    /** Title content for the banner. */
    title: String,
    /** Status icon to display in the banner. */
    icon: String,
    /** Renders the banner without a status icon. */
    hideIcon: Boolean,
    /** Action for banner */
    actions: Array as () => ActionType[],
    /** Sets the status of the banner. (info, success, warning, critical) */
    status: String,
    /** Callback when banner is dismissed */
    onDismiss: Function,
  },
  setup(
    { title, onDismiss, actions, status, icon, hideIcon },
    { slots, emit },
  ) {
    const className = classNames(
      "flex",
      "beae-banner",
      "rounded-lg",
      "border",
      status ? `bg-${status}` : "bg-default",
    )
    const dismissButton = h(
      "div",
      {
        class: "beae-banner__dismiss",
        onClick: () => {
          emit("dismiss")
        },
      },
      h(
        "button",
        {
          class: "beae-button",
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
      ),
    )

    function iconContent() {
      let iconContent = ""
      switch (status) {
        case "success":
          iconContent =
            '<path d="M13.28 9.03a.75.75 0 0 0-1.06-1.06l-2.97 2.97-1.22-1.22a.75.75 0 0 0-1.06 1.06l1.75 1.75a.75.75 0 0 0 1.06 0l3.5-3.5Z"></path><path fill-rule="evenodd" d="M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"></path>'
          break
        case "critical":
          iconContent =
            '<path d="M10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z"></path><path d="M11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path><path fill-rule="evenodd" d="M11.237 3.177a1.75 1.75 0 0 0-2.474 0l-5.586 5.585a1.75 1.75 0 0 0 0 2.475l5.586 5.586a1.75 1.75 0 0 0 2.474 0l5.586-5.586a1.75 1.75 0 0 0 0-2.475l-5.586-5.585Zm-1.414 1.06a.25.25 0 0 1 .354 0l5.586 5.586a.25.25 0 0 1 0 .354l-5.586 5.585a.25.25 0 0 1-.354 0l-5.586-5.585a.25.25 0 0 1 0-.354l5.586-5.586Z"></path>'
          break
        default:
        case "warning":
        case "info":
          iconContent =
            '<path d="M10 14a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-.75.75Z"></path><path d="M9 7a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"></path><path fill-rule="evenodd" d="M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"></path>'
          break
      }
      return h("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        style: {
          width: "24px",
          height: "24px",
        },
        innerHTML: iconContent,
      })
    }
    return () =>
      h(
        "div",
        {
          class: className,
        },
        [
          !hideIcon
            ? h(
                "div",
                { class: "beae-banner__icon" },
                icon ? icon : iconContent(),
              )
            : null,
          h(
            "div",
            {},
            [
              onDismiss ? dismissButton : null,
              h("div", { class: "beae-banner__title" }, title),
              h("div", { class: "beae-banner__content" }, slots.default?.()),
              h(
                "div",
                { class: "beae-banner__actions flex" },
                actions?.map((action) => {
                  return h(
                    action.type,
                    {
                      class: "beae-banner__action",
                      onClick: () => {
                        action.handle()
                      },
                    },
                    action.label,
                  )
                }),
              ),
            ].filter((x) => x),
          ),
        ].filter((x) => x),
      )
  },
})
