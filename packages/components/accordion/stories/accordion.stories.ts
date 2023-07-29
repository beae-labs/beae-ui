import type { StoryFn } from "@storybook/vue3"
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  AccordionButton,
} from "../src"
import { Box } from "@beae-ui/layout"

export default {
  title: "Components / Accordion",
  component: {
    Accordion,
    AccordionItem,
    AccordionPanel,
    AccordionIcon,
    AccordionButton,
    Box,
  },
}

const Template: StoryFn = (args: any) => ({
  components: {
    Accordion,
    AccordionItem,
    AccordionPanel,
    AccordionIcon,
    AccordionButton,
    Box,
  },
  setup() {
    return { args }
  },
  template: `
  <Accordion>
    <AccordionItem>
      <AccordionButton>
        <Box flex="1" text-align="left">
          Section 1 title
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem>
      <AccordionButton>
        <Box flex="1" text-align="left">
          Section 2 title
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
  `,
})

export const Basic = Template.bind({})

const ExpandTemplate: StoryFn = (args: any) => ({
  components: {
    Accordion,
    AccordionItem,
    AccordionPanel,
    AccordionIcon,
    AccordionButton,
    Box,
  },
  setup() {
    return { args }
  },
  template: `
  <Accordion :allow-multiple="true" :default-index="[0]">
  <AccordionItem>
    <AccordionButton>
      <Box flex="1" text-align="left">
        Section 1 title
      </Box>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem>
    <AccordionButton>
      <Box flex="1" text-align="left">
        Section 2 title
      </Box>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>
</Accordion>
  `,
})

export const ExpandMultipleItems = ExpandTemplate.bind({})

const ToggleTemplate: StoryFn = (args: any) => ({
  components: {
    Accordion,
    AccordionItem,
    AccordionPanel,
    AccordionIcon,
    AccordionButton,
    Box,
  },
  setup() {
    return { args }
  },
  template: `
  <Accordion :allow-toggle="true">
  <AccordionItem>
    <AccordionButton>
      <Box flex="1" text-align="left">
        Section 1 title
      </Box>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem>
    <AccordionButton>
      <Box flex="1" text-align="left">
        Section 2 title
      </Box>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>
</Accordion>
  `,
})

export const ToggleEachItems = ToggleTemplate.bind({})

const StylingTemplate: StoryFn = (args: any) => ({
  components: {
    Accordion,
    AccordionItem,
    AccordionPanel,
    AccordionIcon,
    AccordionButton,
    Box,
  },
  setup() {
    return { args }
  },
  template: `
  <Accordion allowToggle>
    <AccordionItem>
    <AccordionButton :_expanded="{ bg: 'tomato', color: 'white' }">
      <Box flex="1" text-align="left">
        Section 1 title
      </Box>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>
   </Accordion>
  `,
})

export const StylingExpanded = StylingTemplate.bind({})

const AccessingTemplate: StoryFn = (args: any) => ({
  components: {
    Accordion,
    AccordionItem,
    AccordionPanel,
    AccordionIcon,
    AccordionButton,
    Box,
  },
  setup() {
    return { args }
  },
  template: `
  <Accordion :allow-toggle="true">
  <AccordionItem>
    <AccordionButton>
      <Box flex="1" text-align="left">
        Section 1 title
      </Box>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem v-slot="isExpanded">
    <AccordionButton>
      <Box flex="1" text-align="left">
        Section 2 title
      </Box>
      <AccordionIcon size="12px" :name="isExpanded ? 'minus' : 'add'" />
    </AccordionButton>
    <AccordionPanel >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>
</Accordion>
  `,
})

export const Accessing = AccessingTemplate.bind({})
