import { createApp } from "vue"
import { createBeae, extendTheme } from "@beae-ui/vue"
import { mode } from "@beae-ui/theme-tools"
import App from "./App.vue"

const app = createApp(App)

app.use(
  createBeae({
    cssReset: true,
    icons: {
      extend: {
        discord: {
          path: '<path fill="currentColor" d="M297.216" fill="currentColor"></path>',
          viewBox: "0 0 496 512",
        },
      },
      library: {},
    },
    extendTheme: extendTheme({
      config: {
        initialColorMode: "system",
      },
      fonts: {
        heading: `SplineSans, sans-serif, Inter, sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
        body: `SplineSans, sans-serif, Inter, sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
      },
      shadows: {
        outline: `0 0 0 4px rgba(47, 133, 90, 0.62)`,
        inset: `inset 0 2px 0 0 rgb(255 255 255 / 10%)`,
        search:
          "0 0 0 1px rgba(16,22,26,.1), 0 4px 8px rgba(16,22,26,.2), 0 18px 46px 6px rgba(16,22,26,.2)",
      },
      styles: {
        global: (props: any) => {
          return {
            body: {
              bg: mode("white", "gray.900")(props),
              color: mode("blackAlpha.800", "whiteAlpha.900")(props),
              "a.router-link-active": {
                color: mode("teal.500", "teal.200")(props),
                fontSize: mode("0.9rem", "0.9rem")(props),
                fontWeight: mode("bold", "bold")(props),
                textDecoration: mode("underline", "underline")(props),
              },
            },
          }
        },
      },
      components: {
        Button: {
          baseStyle: {
            shadow: "inset",
            background: "red",
            color: "green",
          },
        },
      },
    }),
  }),
)

app.mount("#app")
