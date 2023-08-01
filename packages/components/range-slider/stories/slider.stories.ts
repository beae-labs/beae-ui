import { Meta, StoryObj } from "@storybook/vue3"
import {
  Slider,
  SliderMark,
  SliderThumb,
  SliderTrack,
  SliderFilledTrack,
} from "../src"
import { ref } from "vue"

const meta = {
  title: "Example/Range slider",
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

export const HorizontalSlider: StoryObj = {
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

export const VerticalSlider: StoryObj = {
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
    template: ` <Slider colorScheme="red" isReversed orientation="vertical">
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
      <SliderMark :value="90" children="90%" left="40px" />
    </Slider>`,
  }),
  args: {},
}
export const BeaeHorizontalSlider: StoryObj = {
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
      <SliderThumb children="#" boxSize="30px" color="black" />
    </Slider>`,
  }),
  args: {},
}

export const SteppedHorizontalSlider: StoryObj = {
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
      function setValue(payload: number) {
        value.value = payload
      }
      return {
        args,
      }
    },
    template: `<Slider :value="value" :onChange="setValue" :min="1" :max="7" :step="2">
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb :children="value" boxSize="30px" color="black" />
    </Slider>`,
  }),
  args: {},
}
