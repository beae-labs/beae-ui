import type { StoryFn } from "@storybook/vue3"
import { SkeletonCircle, SkeletonText, Skeleton } from "../src"
import { Button } from "../../button"
import { Box, Stack } from "../../layout"
import { ref } from "vue"

export default {
  title: "Components / Skeleton",
  component: { SkeletonCircle, SkeletonText, Skeleton, Box },
}

const BasicTemplate: StoryFn = (args: any) => ({
  components: { SkeletonCircle, SkeletonText, Skeleton, Stack, Box },
  setup() {
    return { args }
  },
  template: `
    <h2> Basic </h2>
    <Stack>
      <Skeleton height='20px' />
      <Skeleton height='20px' />
      <Skeleton height='20px' />
    </Stack>
    <Skeleton>
      <div>contents wrapped</div>
      <div>won't be visible</div>
    </Skeleton>
    `,
})

export const Basic = BasicTemplate.bind({})

const SkeletonColorTemplate: StoryFn = (args: any) => ({
  components: { SkeletonCircle, SkeletonText, Skeleton, Stack, Box },
  setup() {
    return { args }
  },
  template: `
    <h2> Skeleton color# </h2>
    <Skeleton startColor='pink.500' endColor='orange.500' height='50px' />
    `,
})

export const SkeletonColor = SkeletonColorTemplate.bind({})

const CircleTemplate: StoryFn = (args: any) => ({
  components: { SkeletonCircle, SkeletonText, Skeleton, Stack, Box },
  setup() {
    return { args }
  },
  template: `
    <h2> Circle and Text Skeleton#
    </h2>
    <Box padding='6' boxShadow='lg' bg='white'>
      <SkeletonCircle size='10' />
      <SkeletonText :mt='4' :noOfLines="4" spacing='4' skeletonHeight='2' />
    </Box>
    `,
})

export const CircleAnText = CircleTemplate.bind({})

const ToggleTemplate: StoryFn = (args: any) => ({
  components: {
    SkeletonCircle,
    SkeletonText,
    Skeleton,
    Box,
    Button,
    Stack,
  },
  setup() {
    const isLoaded: any = ref(false)

    function setIsLoaded() {
      isLoaded.value = !isLoaded.value
    }

    return { args, setIsLoaded, isLoaded }
  },
  template: `
    <h2>  Toggle  </h2>
    <Stack padding="4" spacing="1">
    <Skeleton height='40px' :isLoaded="isLoaded">
      <Box>Hello World!</Box>
    </Skeleton>
    <Skeleton
      height='40px'
      :isLoaded="isLoaded"
      bg='green.500'
      color='white'
      :fadeDuration="1"
    >
      <Box>Hello Vue!</Box>
    </Skeleton>
    <Skeleton
      height='40px'
      :isLoaded="isLoaded"
      :fadeDuration="1"
      bg='blue.500'
      color='white'
    >
      <Box>Hello Luniand!</Box>
    </Skeleton>

    <Box textAlign='center'>
      <Button @click="setIsLoaded">toggle</Button>
    </Box>
  </Stack>
    `,
})

export const contentIsLoaded = ToggleTemplate.bind({})
