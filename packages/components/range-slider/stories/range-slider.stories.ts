import {
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderTrack,
  RangeSliderThumb,
} from "../src"
import type { Meta, StoryObj } from "@storybook/vue3"

import { ref, watchEffect } from "vue"

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Example/Range slider",
  component: {
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderTrack,
    RangeSliderThumb,
  } as any,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<
  | typeof RangeSliderThumb
  | typeof RangeSlider
  | typeof RangeSliderFilledTrack
  | typeof RangeSliderTrack
>
export default meta
type RangeSliderType = StoryObj<typeof meta>
export const HorizontalRangeSlider: RangeSliderType = {
  render: (args) => ({
    components: {
      RangeSlider,
      RangeSliderTrack,
      RangeSliderFilledTrack,
      RangeSliderThumb,
    },
    setup() {
      const test = ref([1, 100])
      return {
        args,
        onchange,
        test,
      }
    },
    template: `
    <div>{{test}}</div>
    <RangeSlider v-model:value="test">
      <RangeSliderTrack>
        <RangeSliderFilledTrack />
      </RangeSliderTrack>
      <RangeSliderThumb :index="0" />
      <RangeSliderThumb :index="1" />
    </RangeSlider>`,
  }),
  args: {},
}
export const VerticalRangeSlider: RangeSliderType = {
  render: (args) => ({
    components: {
      RangeSlider,
      RangeSliderTrack,
      RangeSliderFilledTrack,
      RangeSliderThumb,
    },
    setup() {
      return {
        args,
      }
    },
    template: `<div style="height: 200px">
    <RangeSlider orientation="vertical" :onChangeEnd="console.log">
    <RangeSliderTrack>
      <RangeSliderFilledTrack />
    </RangeSliderTrack>
    <RangeSliderThumb :index="0" />
    <RangeSliderThumb :index="1" />
  </RangeSlider>
    </div>`,
  }),
  args: {},
}

export const SteppedHorizontalRangeSlider: RangeSliderType = {
  render: (args) => ({
    components: {
      RangeSlider,
      RangeSliderTrack,
      RangeSliderFilledTrack,
      RangeSliderThumb,
    },
    setup() {
      const value = ref([3, 10])
      function setValue(payload: number[]) {
        console.log(payload)
        // value.value = payload
      }
      return {
        args,
        value,
        setValue,
      }
    },
    template: `<RangeSlider
        colorScheme="pink"
        :value="value"
        :onChange="setValue"
        :min="1"
        :max="20"
        :step="2"
        >
        <RangeSliderTrack>
            <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb :index="0" />
        <RangeSliderThumb :index="1" />
        </RangeSlider>`,
  }),
  args: {},
}

export const DynamicRangeSlider: RangeSliderType = {
  render: (args) => ({
    components: {
      RangeSlider,
      RangeSliderTrack,
      RangeSliderFilledTrack,
      RangeSliderThumb,
    },
    setup() {
      const points = ref<number[]>([30, 70])
      function setPoints(payload: number[]) {
        console.log(payload, "enddddd")
      }
      // watchEffect(() => {
      //   setTimeout(() => {
      //     setPoints([30, 50, 70]);
      //   }, 5000)
      // })
      return {
        args,
        points,
        setPoints,
      }
    },
    template: `
    <RangeSlider :value="points" :onChange="setPoints">
      <RangeSliderTrack>
        <RangeSliderFilledTrack />
      </RangeSliderTrack>
        <RangeSliderThumb v-for="(point, index) in points" :key="index" :index="index" />
    </RangeSlider>`,
  }),
  args: {},
}
