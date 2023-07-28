import type { StoryFn } from "@storybook/vue3"
import { SkipNavContent, SkipNavLink } from "../src"
import { Box, Kbd, List, ListItem, Text } from "@beae-ui/layout"
import { Icon } from "@beae-ui/icon"

import { Code } from "@beae-ui/code"
import { Input } from "@beae-ui/input"

export default {
  title: "Components / Skip-Nav",
  component: {
    Box,
    Kbd,
    List,
    ListItem,
    Text,
    SkipNavContent,
    SkipNavLink,
    Input,
    Code,
    Icon,
  },
}

const Template: StoryFn = (args: any) => ({
  components: {
    Box,
    Kbd,
    List,
    ListItem,
    Text,
    SkipNavContent,
    SkipNavLink,
    Input,
    Code,
    Icon,
  },
  setup() {
    return { args }
  },
  template: `
    <Box position="relative">
    <SkipNavLink> HELLO SkipNav </SkipNavLink>
    <SkipNavContent>
      <main>
        <Text>
          To test the SkipNav Components:
          <List mb="4">
            <ListItem>
              <Icon name="chevron-right" />
              Place focus on the below input
            </ListItem>
            <ListItem>
              <Icon name="chevron-right" />
              Press <Kbd>Shift + Tab</Kbd> to make the
              <Code>SkipNavLink</Code> appear
            </ListItem>
            <ListItem>
              <Icon name="chevron-right" />
              Hit <Kbd>Enter</Kbd>.
            </ListItem>
            <ListItem>
              <Icon name="chevron-right" />
              You should now see the focus over all the content with a blue
              outline.
            </ListItem>
          </List>
        </Text>
        <label>Example Form Search</label>
        <Input placeholder="Search" />
      </main>
    </SkipNavContent>
  </Box>
  `,
})

export const Basic = Template.bind({})
