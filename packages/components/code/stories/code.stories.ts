import type { Meta, StoryObj } from "@storybook/vue3"

import { Code } from "../src"
import { ref } from "vue"

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Example/Code",
  component: Code as any,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "subtle", "outline"],
    },
  },
  args: {
    variant: "subtle",
  },
} satisfies Meta<typeof Code>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (args) => ({
    components: { Code },
    setup() {
      return {
        args,
      }
    },
    template: `<Code :variant="args.variant">Example Code</Code>`,
  }),
  args: {},
}
