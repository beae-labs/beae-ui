import type { Meta, StoryObj } from "@storybook/vue3"

// import { Button } from "../../button"
import { Alert, AlertIcon, AlertDescription, AlertTitle } from "../src"

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Example/Alert",
  component: {
    Alert,
    AlertIcon,
    AlertDescription,
    AlertTitle,
  } as any,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["success", "error", "warning", "info"],
    },
    variant: {
      control: "select",
      options: ["polaris", "solid", "top-accent", "left-accent", "subtle"],
    },
  },
  args: {
    status: "success",
    variant: "polaris",
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (args) => ({
    components: { Alert, AlertIcon, AlertDescription, AlertTitle },
    setup() {
      return {
        args,
      }
    },
    template: `
<Alert :status='args.status' :variant='args.variant'>
    <AlertIcon />
    There was an error processing your request
  </Alert>
  `,
  }),
  args: {},
}
