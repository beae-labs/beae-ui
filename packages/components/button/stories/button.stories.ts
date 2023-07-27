import type { Meta, StoryObj } from "@storybook/vue3"

import { Button } from "../src"
import { ref } from "vue"

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Example/Button",
  component: Button as any,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["large", "medium", "slim", "micro"] },
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "outlineMonochrome",
        "plain",
        "plainMonochrome",
        "plainDestructive",
        "primary",
        "destructive",
      ],
    },
  },
  args: {
    size: "md",
    variant: "default",
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
    components: { Button },
    setup() {
      return {
        args,
      }
    },
    template: `<Button :size="args.size" :variant="args.variant">Button</Button>`,
  }),
  args: {},
}
