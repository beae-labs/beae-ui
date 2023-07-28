import type { Meta, StoryObj } from "@storybook/vue3"

import { Image } from "../src"

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Example/Image",
  component: Image as any,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["150px", "300px", "450px"] },
    rounded: {
      control: "select",
      options: ["0", "10", "20", "30", "full"],
    },
    loading: {
      control: "select",
      options: ["eager", "lazy"],
    },
    fit: {
      control: "select",
      options: ["fill", "contain", "cover", "none", "scale-down"],
    },
    align: {
      control: "select",
      options: ["top", "center", "bottom", "left", "right"],
    },
    src: {
      control: "text",
    },
    srcSet: {
      control: "text",
    },
  },
  args: {
    size: "300px",
    fit: "cover",
    src: "https://blenderartists.org/uploads/default/original/4X/6/b/d/6bd60ee1bd5eccee2ef7af0446388d2aab7c8e8e.jpeg",
    loading: "lazy",
  },
} satisfies Meta<typeof Image>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (args) => ({
    components: { Image },
    setup() {
      return {
        args,
      }
    },
    template: `
    <Image
      :rounded="args.rounded"
      :size="args.size"
      :fit="args.fit"
      :loading="args.loading"
      :align="args.align"
      :srcSet="args.srcSet"
      :src="args.src"
      alt="Jonathan Bakebwa"
    />`,
  }),
  args: {},
}
