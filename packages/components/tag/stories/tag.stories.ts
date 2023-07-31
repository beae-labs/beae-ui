import type { Meta, StoryObj } from "@storybook/vue3"
import { Tag, TagLeftIcon, TagLabel, TagCloseButton } from "../src"

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Example/Tag",
  component: Tag as any,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    variant: {
      control: "select",
      options: ["solid", "subtle", "outline"],
    },
    borderRadius: {
      control: "select",
      options: ["full", "sm", "md"],
    },
    colorScheme: {
      control: "select",
      options: ["whiteAlpha", "blackAlpha", "gray", "red"],
    },
  },
  args: {
    size: "lg",
    variant: "solid",
    borderRadius: "full",
    colorScheme: "red",
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (args) => ({
    components: { Tag, TagLeftIcon, TagLabel, TagCloseButton },
    setup() {
      return {
        args,
      }
    },
    template: `<div>
        <Stack :spacing="4" align-items="start" is-inline>
            <Tag :size="args.size" :key="args.size" :variant="args.variant" :color-scheme="args.colorScheme" :border-radius="args.borderRadius">
                <TagLeftIcon size="12px" > </TagLeftIcon>
                <TagLabel> Vue {{ size }} </TagLabel>
                <TagCloseButton> </TagCloseButton>
            </Tag>
        </Stack>
    </div>`,
  }),
  args: {},
}
