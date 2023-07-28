import type { StoryFn } from "@storybook/vue3"
import { Textarea } from "../src"
import { ref } from "vue"
export default {
  title: "Components / TextArea",
  component: {
    Textarea,
  },
}

const Template: StoryFn = (args: any) => ({
  components: {
    Textarea,
  },
  setup() {
    return { args }
  },
  template: `
    <Textarea placeholder="Here is a sample placeholder" />
  `,
})

export const Basic = Template.bind({})

const DisabledTemplate: StoryFn = (args: any) => ({
  components: {
    Textarea,
  },
  setup() {
    return { args }
  },
  template: `
  <Textarea  is-disabled placeholder="A disabled textarea" />
`,
})

export const DisabledTextarea = DisabledTemplate.bind({})

const InvalidTextareaTemplate: StoryFn = (args: any) => ({
  components: {
    Textarea,
  },
  setup() {
    const check = ref(true)
    return { args, check }
  },
  template: `
  <Textarea is-invalid  required error-border-color="crimson" placeholder="An invalid textarea" />
`,
})

export const InvalidTextarea = InvalidTextareaTemplate.bind({})
