import type { Meta, StoryFn, StoryObj } from "@storybook/vue3"
import { Alert, AlertIcon, AlertTitle, AlertDescription } from "../src"
import { beae } from "@beae-ui/vue"

const meta = {
  title: "Example/Alert",
  component: { Alert, AlertIcon, AlertTitle, AlertDescription } as any,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["success", "error", "warning", "info", "loading"],
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

const BasicTemplate: StoryFn = (args: any) => ({
  components: { Alert, AlertIcon, AlertTitle, AlertDescription },
  setup() {
    return { args }
  },
  template: `
        <Alert :status="args.status">
            <AlertIcon />
            <AlertTitle>Your browser is outdated!</AlertTitle>
            <AlertDescription>Your beae experience may be degraded.</AlertDescription>
        </Alert>
  `,
})

export const Basic: Story = {
  render: BasicTemplate.bind({}),
  args: {},
}
const PolarisTemplate: StoryFn = (args: any) => ({
  components: { Alert, AlertIcon, AlertTitle, AlertDescription },
  setup() {
    return { args }
  },
  template: `
        <Alert :status="args.status" :variant="polaris">
            <AlertIcon />
            <AlertTitle>Your browser is outdated!</AlertTitle>
            <AlertDescription>Your beae experience may be degraded.</AlertDescription>
        </Alert>
  `,
})

export const Polaris: Story = {
  render: PolarisTemplate.bind({}),
  args: {},
}

const SubtleTemplate: StoryFn = (args: any) => ({
  components: { Alert, AlertIcon, AlertTitle, AlertDescription, beae },
  setup() {
    return { args }
  },
  template: `
  <Alert :status="args.status">
    <AlertIcon />
    <beae.div>
      <AlertTitle>Your browser is outdated!</AlertTitle>
      <AlertDescription>Your beae experience may be degraded.</AlertDescription>
    </beae.div>
  </Alert>
  `,
})

export const Subtle: Story = {
  render: SubtleTemplate.bind({}),
  args: {},
}

const TopAccentTemplate: StoryFn = (args: any) => ({
  components: { Alert, AlertIcon, AlertTitle, AlertDescription, beae },
  setup() {
    return { args }
  },
  template: `
  <Alert
    variant="top-accent"
    mx="auto"
    alignItems="flex-start"
    pt="3"
    rounded="md"
    :status="args.status"
    >
    <AlertIcon />
    <div flex="1">
      <AlertTitle display="block" mr="2">
        Holy Smokes
      </AlertTitle>
      <AlertDescription>Something just happened!</AlertDescription>
    </div>
  </Alert>
  `,
})

export const TopAccent: Story = {
  render: TopAccentTemplate.bind({}),
  args: {},
}

const LoadingTemplate: StoryFn = (args: any) => ({
  components: { Alert, AlertIcon, beae },
  setup() {
    return { args }
  },
  template: `
  <beae.div>
    <Alert status="loading">
      <AlertIcon />
      We are loading something
    </Alert>
  </beae.div>
  `,
})

export const Loading: Story = {
  render: LoadingTemplate.bind({}),
  args: {},
}
