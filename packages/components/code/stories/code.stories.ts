import type { StoryFn } from "@storybook/vue3"
import { Code } from "../src"
export default {
  title: "Components / Code",
  component: {
    Code,
  },
}

const Template: StoryFn = (args: any) => ({
  components: {
    Code,
  },
  setup() {
    return { args }
  },
  template: `
    <Code> Hello world </Code>
  `,
})

export const Basic = Template.bind({})

const ColorCodeTemplate: StoryFn = (args: any) => ({
  components: {
    Code,
  },
  setup() {
    return { args }
  },
  template: `
    <Code>console.log(welcome)</Code>
    <Code colorScheme='red' >var beae-ui = 'awesome!'></Code>
    <Code colorScheme="yellow">npm install node</Code>
  `,
})

export const ColorCode = ColorCodeTemplate.bind({})
