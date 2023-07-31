import { beae } from "@beae-ui/system"
import { CircularProgress, CircularProgressLabel } from "../src"
import { Meta, StoryObj } from "@storybook/vue3"

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Example/Progress",
  component: { CircularProgress, CircularProgressLabel } as any,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof CircularProgress | typeof CircularProgressLabel>

export default meta
type CircularProgressTyoe = StoryObj<typeof meta>

export const BasicCircular: CircularProgressTyoe = {
  render: (args) => ({
    components: { CircularProgress },
    setup() {
      return {
        args,
      }
    },
    template: `<CircularProgress trackColor="gray.200" size="120px" :value="20" />`,
  }),
  args: {},
}
export const withSizeCircular: CircularProgressTyoe = {
  render: (args) => ({
    components: { CircularProgress },
    setup() {
      return {
        args,
      }
    },
    template: `<CircularProgress trackColor="gray.200" size="120px" :value="60" />`,
  }),
  args: {},
}

export const withThicknessCircular: CircularProgressTyoe = {
  render: (args) => ({
    components: { CircularProgress },
    setup() {
      return {
        args,
      }
    },
    template: `<CircularProgress thickness="3px" size="120px" :value="60" />`,
  }),
  args: {},
}

export const withLabelCircular: CircularProgressTyoe = {
  render: (args) => ({
    components: { CircularProgress, CircularProgressLabel },
    setup() {
      return {
        args,
      }
    },
    template: `<CircularProgress size="120px" :value="60">
    <CircularProgressLabel>60%</CircularProgressLabel>
  </CircularProgress>`,
  }),
  args: {},
}

export const circularIndeterminateCircular: CircularProgressTyoe = {
  render: (args) => ({
    components: { CircularProgress, CircularProgressLabel },
    setup() {
      return {
        args,
      }
    },
    template: `<CircularProgress
      capIsRound
      trackColor="transparent"
      size="50px"
      isIndeterminate
      :value="3"
    />`,
  }),
  args: {},
}

export const withZeroValueCircular: CircularProgressTyoe = {
  render: (args) => ({
    components: { CircularProgress },
    setup() {
      return {
        args,
      }
    },
    template: `<CircularProgress :value="0" />`,
  }),
  args: {},
}
