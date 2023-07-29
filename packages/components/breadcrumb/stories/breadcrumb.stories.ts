import type { StoryFn } from "@storybook/vue3"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "../src"
import { Stack } from "@beae-ui/layout"
import { NavigationFailureType } from "vue-router"
export default {
  title: "Components / BreadCrumb",
  component: {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  },
}

const Template: StoryFn = (args: any) => ({
  components: {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  },
  setup() {
    return { args }
  },
  template: `
    <Breadcrumb>
      <BreadcrumbItem>
          <BreadcrumbLink href="#">Breadcrumb 1</BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
          <BreadcrumbLink href="#">Breadcrumb 2</BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">Breadcrumb 3</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  `,
})

export const Basic = Template.bind({})

const SeparatorsTemplate: StoryFn = (args: any) => ({
  components: {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  },
  setup() {
    return { args }
  },
  template: `
    <Breadcrumb :add-separator="false">
    <BreadcrumbItem>
        <BreadcrumbLink href="#">Breadcrumb 1</BreadcrumbLink>
        <BreadcrumbSeparator color="blue" font-size="35px" font-weight="bold" />
    </BreadcrumbItem>

    <BreadcrumbItem>
        <BreadcrumbLink href="#">Breadcrumb 2</BreadcrumbLink>
        <BreadcrumbSeparator color="firebrick" font-size="20px" />
    </BreadcrumbItem>
    
    <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink href="#">Breadcrumb 2</BreadcrumbLink>
    </BreadcrumbItem>
    </Breadcrumb>
  `,
})

export const SeparatorsBreadCrumb = SeparatorsTemplate.bind({})

const RouterTemplate: StoryFn = (args: any) => ({
  components: {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  },
  setup() {
    return { args }
  },
  template: `
    <Breadcrumb separator="›">
    <BreadcrumbItem>
        <BreadcrumbLink as="router-link" to="/">Components</BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbItem>
        <BreadcrumbLink as="router-link" to="/breadcrumb">Breadcrumb</BreadcrumbLink>
    </BreadcrumbItem>
    </Breadcrumb>
  `,
})

export const RouterBreadCrumb = RouterTemplate.bind({})
