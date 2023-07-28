import type { Meta, StoryObj } from "@storybook/vue3"

import { Code } from "../src"

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Example/Code",
  component: Code as any,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    variant: {
      control: "select",
      options: ["ghost", "outline", "solid", "link", "unstyled"],
    },
  },
  args: {
    size: "md",
    variant: "solid",
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
    template: `<Code v-bind="args">Example Code</Code>`,
  }),
  args: {},
}
