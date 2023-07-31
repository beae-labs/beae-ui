import { beae } from "@beae-ui/system"
// import { extendTheme, useTheme, ThemeProvider } from "@beae-ui/react"
import { Progress, ProgressLabel } from "../src"
import { Meta, StoryObj } from "@storybook/vue3"

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Example/Progress",
  component: { Progress, ProgressLabel } as any,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof Progress | typeof ProgressLabel>

export default meta
type ProgressType = StoryObj<typeof meta>

export const Basic: ProgressType = {
  render: (args) => ({
    components: { Progress },
    setup() {
      return {
        args,
      }
    },
    template: `<Progress :value="50" />`,
  }),
  args: {},
}

export const withColorScheme: ProgressType = {
  render: (args) => ({
    components: { Progress },
    setup() {
      return {
        args,
      }
    },
    template: `<Progress :value="20" colorScheme="pink" />`,
  }),
  args: {},
}

export const indeterminate: ProgressType = {
  render: (args) => ({
    components: { Progress },
    setup() {
      return {
        args,
      }
    },
    template: `<Progress margin="20px" colorScheme="cyan" size="xs" isIndeterminate />`,
  }),
  args: {},
}
export const withLabel: ProgressType = {
  render: (args) => ({
    components: { Progress, ProgressLabel },
    setup() {
      return {
        args,
      }
    },
    template: `<Progress :value="60">
      <ProgressLabel>60%</ProgressLabel>
    </Progress>`,
  }),
  args: {},
}

export const withStripe: ProgressType = {
  render: (args) => ({
    components: { Progress, ProgressLabel },
    setup() {
      return {
        args,
      }
    },
    template: `<Progress hasStripe :value="20" colorScheme="green">
      <ProgressLabel>60%</ProgressLabel>
    </Progress>`,
  }),
  args: {},
}

export const withSizes: ProgressType = {
  render: (args) => ({
    components: { Progress, ProgressLabel },
    setup() {
      return {
        args,
      }
    },
    template: `<div>
      <Progress colorScheme="green" size="sm" :value="20" />
      <br />
      <Progress colorScheme="green" size="md" :value="20" />
      <br />
      <Progress colorScheme="green" size="lg" :value="20" />
    </div>`,
  }),
  args: {},
}

export const withAnimation: ProgressType = {
  render: (args) => ({
    components: { Progress, ProgressLabel },
    setup() {
      return {
        args,
      }
    },
    template: `<Progress colorScheme="green" hasStripe isAnimated :value="20" />`,
  }),
  args: {},
}

export const withCustomBorderRadius: ProgressType = {
  render: (args) => ({
    components: { Progress, ProgressLabel },
    setup() {
      return {
        args,
      }
    },
    template: `<Progress :value="20" borderRadius="4px" />`,
  }),
  args: {},
}
