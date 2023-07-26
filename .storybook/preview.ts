import type { App } from "vue"

import { Preview, setup } from "@storybook/vue3"
import Beae from "@beae-ui/vue"

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

setup((app: App) => {
  app.use(Beae)
})

export default preview
