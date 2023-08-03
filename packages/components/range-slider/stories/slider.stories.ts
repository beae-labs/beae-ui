import { Meta, StoryObj } from "@storybook/vue3"
import {
  Slider,
  SliderMark,
  SliderThumb,
  SliderTrack,
  SliderFilledTrack,
} from "../src"
import { ref } from "vue"

const slider = {
  title: "Example/Slider",
  component: {
    Slider,
    SliderMark,
    SliderThumb,
    SliderTrack,
    SliderFilledTrack,
  } as any,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<
  | typeof Slider
  | typeof SliderMark
  | typeof SliderThumb
  | typeof SliderTrack
  | typeof SliderFilledTrack
>
export default slider
type SliderType = StoryObj<typeof slider>
export const HorizontalSlider: SliderType = {
  render: (args) => ({
    components: {
      Slider,
      SliderTrack,
      SliderFilledTrack,
      SliderThumb,
      SliderMark,
    },
    setup() {
      return {
        args,
      }
    },
    template: `<Slider colorScheme="red" :onChangeEnd="console.log">
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
      <SliderMark :value="90" top="20px">
        "90%"
      </SliderMark>
    </Slider>`,
  }),
  args: {},
}

export const VerticalSlider: SliderType = {
  render: (args) => ({
    components: {
      Slider,
      SliderTrack,
      SliderFilledTrack,
      SliderThumb,
      SliderMark,
    },
    setup() {
      return {
        args,
      }
    },
    template: `<div style="height: 200px"><Slider colorScheme="red" isReversed orientation="vertical">
    <SliderTrack>
      <SliderFilledTrack />
    </SliderTrack>
    <SliderThumb />
    <SliderMark :value="90" left="40px"></SliderMark>
  </Slider></div>`,
  }),
  args: {},
}
export const BeaeHorizontalSlider: SliderType = {
  render: (args) => ({
    components: {
      Slider,
      SliderTrack,
      SliderFilledTrack,
      SliderThumb,
      SliderMark,
    },
    setup() {
      return {
        args,
      }
    },
    template: `  <Slider colorScheme="blue" :defaultValue="40">
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb boxSize="30px" color="black">#</SliderThumb>
    </Slider>`,
  }),
  args: {},
}

export const SteppedHorizontalSlider: SliderType = {
  render: (args) => ({
    components: {
      Slider,
      SliderTrack,
      SliderFilledTrack,
      SliderThumb,
      SliderMark,
    },
    setup() {
      const value = ref(1)
      return {
        args,
        value,
      }
    },
    template: `<Slider v-model:value="value" :min="1" :max="10" :step="1">
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb boxSize="30px" color="black">{{value}}</SliderThumb>
    </Slider>`,
  }),
  args: {},
}
