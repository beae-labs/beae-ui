import type { Meta, StoryObj } from "@storybook/vue3"

import {
  Dropdown,
  DropdownDivider,
  DropdownList,
  DropdownButton,
  DropdownGroup,
  DropdownItem,
  DropdownOptionGroup,
  DropdownItemOption,
} from "../src"

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Example/Dropdown",
  component: Dropdown as any,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    variant: {
      control: "select",
      options: ["solid", "outline", "plain"],
    },
    isLazy: { control: "select", options: [true, false] },
  },
  args: {
    size: "md",
    variant: "default",
    isLazy: true,
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (args) => ({
    components: {
      Dropdown,
      DropdownDivider,
      DropdownList,
      DropdownButton,
      DropdownGroup,
      DropdownItem,
      DropdownOptionGroup,
      DropdownItemOption,
    },
    setup() {
      return {
        args,
      }
    },
    template: `<div style={{ minHeight: 4000, paddingTop: 500 }}>
    <Dropdown>
      <DropdownButton
        :variant="args.variant"
        :colorScheme="teal"
        :size="args.size"
        :isLazy="args.isLazy"
      >
      </DropdownButton>
      <DropdownList>
          <DropdownGroup title='Group 1'>
            <DropdownItem key="item-test1">
              Item 1
            </DropdownItem>
            <DropdownItem key="item-test2">
              Item 2
            </DropdownItem>
          </DropdownGroup>
          <DropdownDivider />
          <DropdownGroup title='Group 2'>
            <DropdownItem as='a' href='#' key="item-test3">
              Item 3
            </DropdownItem>
            <DropdownItem key="item-test4">
            Item 4
            </DropdownItem>
          </DropdownGroup>
          <DropdownDivider />
          <DropdownOptionGroup title='Country' type='checkbox'>
            <DropdownItemOption value='email'>Email</DropdownItemOption>
            <DropdownItemOption value='phone'>Phone</DropdownItemOption>
            <DropdownItemOption value='country'>Country</DropdownItemOption>
          </DropdownOptionGroup>
          <DropdownDivider />
          <DropdownOptionGroup defaultValue='asc' title='Order' type='radio'>
            <DropdownItemOption value='asc'>Ascending</DropdownItemOption>
            <DropdownItemOption value='desc'>Descending</DropdownItemOption>
        </DropdownOptionGroup>
        ))}
      </DropdownList>
    </Dropdown>
  </div>`,
  }),
  args: {},
}
