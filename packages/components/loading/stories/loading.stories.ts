import type { Meta, StoryObj } from "@storybook/vue3"

import { Loading } from "../src"

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

const meta = {
  title: "Example/Loading",
  component: Loading as any,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "color" },
    max: { control: "number" },
    min: { control: "number" },
    value: { control: "number" },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    height: { control: "text" },
    hasStripe: { control: "boolean" },
    isIndeterminate: { control: "boolean" },
    isAnimated: { control: "boolean" },
  },
  args: {
    value: 60,
    max: 100,
    min: 0,
    size: "xs",
    color: "blue",
  },
} satisfies Meta<typeof Loading>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  render: (args) => ({
    components: { Loading },
    setup() {
      return {
        args,
      }
    },
    template: `
      <Loading
        :value="args.value"
        :max="args.max"
        :min="args.min"
        :colorScheme="args.color"
        :height="args.height"
        :size="args.size"
        :hasStripe="args.hasStripe"
        :isAnimated="args.isAnimated"
        :isIndeterminate="args.isIndeterminate"
      />
    `,
  }),
  args: {},
}
