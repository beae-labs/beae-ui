import type { Meta, StoryObj } from "@storybook/vue3"
import { Avatar, AvatarGroup, AvatarBadge } from "../src"
import { Stack } from "@beae-ui/layout"

const meta = {
  title: "Example/Avatar",
  component: Avatar as any,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "full"],
    },
    bg: { control: "select", options: ["red", "teal", "yellow"] },
    name: { control: "text" },
    src: { control: "text" },
    borderColor: {
      control: "select",
      options: ["papayawhip", "orange", "blue", "green"],
    },
    boxSize: {
      control: "select",
      options: ["0.5em", "0.75em", "1em", "1.25em", "1.5em"],
    },
    max: { control: "select", options: ["3", "4", "5"] },
    placement: {
      control: "select",
      options: ["top-start", "top-end", "bottom-start", "bottom-end"],
    },
  },
  args: {
    size: "md",
    bg: "yellow",
    name: "Segun Adebayo",
    src: "https://bit.ly/chakra-segun-adebayo",
    borderColor: "green",
    boxSize: "1em",
    placement: "bottom-end",
    max: "3",
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  render: (args) => ({
    components: { Avatar },
    setup() {
      return {
        args,
      }
    },
    template: `<Avatar :bg="args.bg" :size="args.size" :name="args.name" :src="args.src" />`,
  }),
  args: {},
}

export const FallbacksTemplate: Story = {
  render: (args) => ({
    components: { Avatar },
    setup() {
      return {
        args,
      }
    },
    template: `
        <Avatar :bg="args.bg" :size="args.size" :name="args.name" src="https://bit.ly/broken-link" />`,
  }),
  args: {},
}

export const BadgeTemplate: Story = {
  render: (args) => ({
    components: { Avatar, Stack, AvatarBadge },
    setup() {
      return {
        args,
      }
    },
    template: `
        <Avatar :size="args.size" :name="args.name" :src="args.src">
            <AvatarBadge :placement="args.placement" :borderColor='args.borderColor' :bg='args.bg' :boxSize='args.boxSize' />        
        </Avatar>`,
  }),
  args: {},
}

export const AvatarGroupTemplate: Story = {
  render: (args) => ({
    components: { Avatar, AvatarGroup },
    setup() {
      return {
        args,
      }
    },
    template: `
      <AvatarGroup :size="args.size" :max="args.max">
      <Avatar :size="args.size" :name="args.name" src="args.src" />
      <Avatar :size="args.size" :name="args.name" src="args.src" />
      <Avatar :size="args.size" :name="args.name" src="args.src" />
      <Avatar :size="args.size" :name="args.name" src="args.src" />
      <Avatar :size="args.size" :name="args.name" src="args.src" />
      <Avatar :size="args.size" :name="args.name" src="args.src" />
      <Avatar :size="args.size" :name="args.name" src="args.src" />
    </AvatarGroup>`,
  }),
  args: {},
}
